import { EditWorkflow } from "./models/EditWorkflow";
import { Workflow } from "./models/Workflow";
import { getCache } from "./cache";

export const processWorkflow = async (
  workflow: Workflow | EditWorkflow,
  jimp: any
): Promise<string> => {
  type Jimp = typeof jimp;

  const imageCache = getCache<Jimp>();
  const output = await jimp.create(workflow.size.width, workflow.size.height);

  const layers =
    workflow.layers && workflow.layers.length
      ? [...workflow.layers].reverse()
      : [];

  for (let layer of layers) {
    if (layer.content.type === "image") {
      if (!layer.content.location) {
        continue;
      }

      let image: Jimp;

      if (imageCache[layer.content.location]) {
        image = await jimp.read(imageCache[layer.content.location]);
      } else {
        image = await jimp.read(layer.content.location);
        image.clone((_err: any, clone: Jimp) => {
          if (layer.content.location)
            imageCache[layer.content.location] = clone;
        });
      }

      let width: number,
        height: number,
        x = 0,
        y = 0;

      const imageWidth = image.getWidth();
      const imageHeight = image.getHeight();

      const [originVertical, originHorizontal] =
        layer.origin.descriptor.split(" ");
      const [alignmentVertical, alignmentHorizontal] =
        layer.alignment.descriptor.split(" ");

      const imageRatio = imageWidth / imageHeight;
      const outputRatio = workflow.size.width / workflow.size.height;
      const isImageWiderThanOutput = imageRatio > outputRatio;

      if (layer.placement === "cover") {
        if (isImageWiderThanOutput) {
          height = workflow.size.height;
          width = (workflow.size.height / imageHeight) * imageWidth;
        } else {
          width = workflow.size.width;
          height = (workflow.size.width / imageWidth) * imageHeight;
        }
      } else if (layer.placement === "fit") {
        if (isImageWiderThanOutput) {
          width = workflow.size.width;
          height = (workflow.size.width / imageWidth) * imageHeight;
        } else {
          height = workflow.size.height;
          width = (workflow.size.height / imageHeight) * imageWidth;
        }
      } else if (layer.placement === "stretch") {
        width = workflow.size.width;
        height = workflow.size.height;
      } else {
        width = Math.round(imageWidth * layer.scale.x);
        height = Math.round(imageHeight * layer.scale.y);
      }

      if (originHorizontal === "left") {
        x = layer.position.x;
      } else if (originHorizontal === "center") {
        x = layer.position.x - Math.round(width / 2);
      } else if (originHorizontal === "right") {
        x = layer.position.x - width;
      } else {
        throw new Error(
          `Layer origin descriptor is not valid: ${layer.origin.descriptor}`
        );
      }

      if (originVertical === "top") {
        y = layer.position.y;
      } else if (originVertical === "center") {
        y = layer.position.y - Math.round(height / 2);
      } else if (originVertical === "bottom") {
        y = layer.position.y - height;
      } else {
        throw new Error(
          `Layer origin descriptor is not valid: ${layer.origin.descriptor}`
        );
      }

      if (alignmentHorizontal === "left") {
        // Nothing
      } else if (alignmentHorizontal === "center") {
        x += output.getWidth() / 2;
      } else if (alignmentHorizontal === "right") {
        x += output.getWidth();
      } else {
        throw new Error(
          `Layer origin descriptor is not valid: ${layer.alignment.descriptor}`
        );
      }

      if (alignmentVertical === "top") {
        // Nothing
      } else if (alignmentVertical === "center") {
        y += output.getHeight() / 2;
      } else if (alignmentVertical === "bottom") {
        y += output.getHeight() - y;
      } else {
        throw new Error(
          `Layer origin descriptor is not valid: ${layer.origin.descriptor}`
        );
      }

      try {
        image.resize(width, height);
        image.opacity(layer.opacity / 100);
        output.blit(image, x, y);
      } catch (e) {
        throw new Error(`Could not perform operation: ${e}`);
      }
    }
  }

  return await output.getBase64Async(output.getMIME());
};

export const resizeByLongestSide = async (
  image: string,
  maxLengthOfLongestSide: number,
  jimp: any
): Promise<string> => {
  const buffer = Buffer.from(image.split(",")[1], "base64");
  const output = await jimp.read(buffer);

  const width = output.getWidth();
  const height = output.getHeight();

  if (width < maxLengthOfLongestSide && height < maxLengthOfLongestSide) {
    return image;
  }

  if (width > height) {
    output.resize(
      maxLengthOfLongestSide,
      height * (maxLengthOfLongestSide / width)
    );
  } else {
    output.resize(
      width * (maxLengthOfLongestSide / height),
      maxLengthOfLongestSide
    );
  }

  return await output.getBase64Async(output.getMIME());
};
