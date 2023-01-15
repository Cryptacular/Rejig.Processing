import Jimp from "jimp";
import { getDefaultGradientLayerContent } from "../models/GradientLayerContent";
import { Layer } from "../models/Layer";
import { LayerMask } from "../models/LayerMask";
import { getDefaultOrigin } from "../models/Origin";
import { Workflow } from "../models/Workflow";
import { getGradientLayerContent } from "./getGradientLayerContent";
import { getImageLayerContent } from "./getImageLayerContent";
import { getSolidLayerContent } from "./getSolidLayerContent";

export interface RenderedLayer {
  image: Jimp;
  pos: { x: number; y: number };
}

export const renderLayer = async (
  workflow: Workflow,
  layer: Layer | LayerMask
): Promise<RenderedLayer | null> => {
  let layerContent: Jimp | null = null;

  switch (layer.content?.type) {
    case "image":
      layerContent = await getImageLayerContent(layer.content);
      break;

    case "solid":
      layerContent = await getSolidLayerContent(layer.content, workflow);
      break;

    case "gradient":
      layerContent = await getGradientLayerContent(
        getDefaultGradientLayerContent(layer.content),
        workflow
      );
  }

  if (!layerContent) {
    return null;
  }

  let width: number,
    height: number,
    x = 0,
    y = 0;

  const imageWidth = layerContent.getWidth();
  const imageHeight = layerContent.getHeight();

  const [originVertical, originHorizontal] = getDefaultOrigin(
    layer.origin
  )!.split(" ");
  const [alignmentVertical, alignmentHorizontal] = getDefaultOrigin(
    layer.alignment
  )!.split(" ");

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
    width = Math.round(imageWidth * layer.scale!.x);
    height = Math.round(imageHeight * layer.scale!.y);
  }

  if (originHorizontal === "left") {
    x = layer.position!.x!;
  } else if (originHorizontal === "center") {
    x = layer.position!.x! - Math.round(width / 2);
  } else if (originHorizontal === "right") {
    x = layer.position!.x! - width;
  } else {
    throw new Error(`Layer origin is not valid: ${layer.origin}`);
  }

  if (originVertical === "top") {
    y = layer.position!.y!;
  } else if (originVertical === "center") {
    y = layer.position!.y! - Math.round(height / 2);
  } else if (originVertical === "bottom") {
    y = layer.position!.y! - height;
  } else {
    throw new Error(`Layer origin is not valid: ${layer.origin}`);
  }

  if (alignmentHorizontal === "left") {
    // Nothing
  } else if (alignmentHorizontal === "center") {
    x += workflow.size.width / 2;
  } else if (alignmentHorizontal === "right") {
    x += workflow.size.width;
  } else {
    throw new Error(`Layer origin is not valid: ${layer.alignment}`);
  }

  if (alignmentVertical === "top") {
    // Nothing
  } else if (alignmentVertical === "center") {
    y += workflow.size.height / 2;
  } else if (alignmentVertical === "bottom") {
    y += workflow.size.height;
  } else {
    throw new Error(`Layer origin is not valid: ${layer.origin}`);
  }

  layerContent.resize(width, height);

  return { image: layerContent, pos: { x, y } };
};
