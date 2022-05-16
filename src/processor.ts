import { EditWorkflow } from "./models/EditWorkflow";
import { Workflow } from "./models/Workflow";
import { getCache } from "./cache";
import { ImageLayerContent } from "./models/ImageLayerContent";
import { SolidLayerContent } from "./models/SolidLayerContent";

export const processWorkflow = async (
  workflow: Workflow | EditWorkflow,
  jimp: any
): Promise<string> => {
  const output = await jimp.create(workflow.size.width, workflow.size.height);

  const layers =
    workflow.layers && workflow.layers.length
      ? [...workflow.layers].reverse()
      : [];

  for (let layer of layers) {
    let layerContent;

    switch (layer.content.type) {
      case "image":
        layerContent = await getImageLayerContent(jimp, layer.content);
        break;

      case "solid":
        layerContent = await getSolidLayerContent(
          jimp,
          layer.content,
          workflow
        );
        break;
    }

    if (!layerContent) {
      continue;
    }

    let width: number,
      height: number,
      x = 0,
      y = 0;

    const imageWidth = layerContent.getWidth();
    const imageHeight = layerContent.getHeight();

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
      layerContent.resize(width, height);
      layerContent.opacity(layer.opacity / 100);
      output.blit(layerContent, x, y);
    } catch (e) {
      throw new Error(`Could not perform operation: ${e}`);
    }
  }

  return await output.getBase64Async(output.getMIME());
};

const getImageLayerContent = async (
  jimp: any,
  layerContent: ImageLayerContent
): Promise<any> => {
  if (!layerContent.location) {
    return;
  }

  type Jimp = typeof jimp;
  let image: Jimp;
  const imageCache = getCache<Jimp>();

  if (imageCache[layerContent.location]) {
    image = await jimp.read(imageCache[layerContent.location]);
  } else {
    image = await jimp.read(layerContent.location);
    image.clone((_err: any, clone: Jimp) => {
      if (layerContent.location) imageCache[layerContent.location] = clone;
    });
  }

  return image;
};

const getSolidLayerContent = async (
  jimp: any,
  layerContent: SolidLayerContent,
  workflow: Workflow | EditWorkflow
): Promise<any> => {
  if (!layerContent.color) {
    return;
  }

  const image = await jimp.create(1, 1);
  image.opaque();
  image.color([
    { apply: "red", params: [layerContent.color.r] },
    { apply: "green", params: [layerContent.color.g] },
    { apply: "blue", params: [layerContent.color.b] },
  ]);
  image.opacity(layerContent.color.a);
  image.resize(workflow.size.width, workflow.size.height);

  return image;
};
