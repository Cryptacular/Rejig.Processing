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

      const width = Math.round(image.getWidth() * layer.scale.x);
      const height = Math.round(image.getHeight() * layer.scale.y);

      const [originVertical, originHorizontal] =
        layer.origin.descriptor.split(" ");

      let x: number, y: number;

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

      const [alignmentVertical, alignmentHorizontal] =
        layer.alignment.descriptor.split(" ");

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

      if (alignmentHorizontal === "left") {
        // Nothing
      } else if (alignmentHorizontal === "center") {
        x += output.getWidth() / 2;
      } else if (alignmentHorizontal === "right") {
        x += output.getWidth();
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
  environment: "node" | "browser" = "node"
): Promise<string> => {
  const jimp =
    environment === "browser"
      ? require("jimp/browser/lib/jimp")
      : require("jimp");

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
