import { Workflow, validate } from "./models/Workflow";
import { getCache } from "./cache";
import { ImageLayerContent } from "./models/ImageLayerContent";
import { SolidLayerContent } from "./models/SolidLayerContent";
import { GradientLayerContent } from "./models/GradientLayerContent";
import Jimp from "jimp";
import {
  equationOfLineFromPoints,
  equationOfPerpendicularLine,
  getRatioOfPointAlongLine,
  intersectionOfTwoLines,
} from "./utilities/gradientCalculator";
import { Layer } from "./models/Layer";
import { LayerMask } from "./models/LayerMask";
import { getDefaultOrigin } from "./models/Origin";

export const processWorkflow = async (workflow: Workflow): Promise<string> => {
  await validate(workflow);

  const output = await Jimp.create(workflow.size.width, workflow.size.height);

  const layers =
    workflow.layers && workflow.layers.length
      ? [...workflow.layers].reverse()
      : [];

  for (let layer of layers) {
    const renderedLayer = await renderLayer(workflow, layer);

    if (!renderedLayer) {
      continue;
    }

    const blendingMode = getJimpBlendingMode(layer.blendingMode);
    let { image } = renderedLayer;

    if (layer.mask) {
      const mask = await renderLayer(workflow, layer.mask);
      image = mask ? image.mask(mask.image, mask.pos.x, mask.pos.y) : image;
    }

    try {
      let { pos } = renderedLayer;
      output.composite(image, pos.x, pos.y, {
        mode: blendingMode,
        opacitySource: layer.opacity! / 100,
        opacityDest: 1,
      });
    } catch (e) {
      throw new Error(`Could not perform operation: ${e}`);
    }
  }

  return await output.getBase64Async(output.getMIME());
};

const getJimpBlendingMode = (blendingMode: Layer["blendingMode"]): string => {
  if (blendingMode === "multiply") return Jimp.BLEND_MULTIPLY;
  if (blendingMode === "add") return Jimp.BLEND_ADD;
  if (blendingMode === "screen") return Jimp.BLEND_SCREEN;
  if (blendingMode === "overlay") return Jimp.BLEND_OVERLAY;
  if (blendingMode === "darken") return Jimp.BLEND_DARKEN;
  if (blendingMode === "lighten") return Jimp.BLEND_LIGHTEN;
  if (blendingMode === "hardlight") return Jimp.BLEND_HARDLIGHT;
  if (blendingMode === "difference") return Jimp.BLEND_DIFFERENCE;
  if (blendingMode === "exclusion") return Jimp.BLEND_EXCLUSION;

  return Jimp.BLEND_SOURCE_OVER;
};

const getImageLayerContent = async (
  layerContent: ImageLayerContent
): Promise<Jimp | null> => {
  if (!layerContent.location) {
    return null;
  }

  let image: Jimp;
  const imageCache = getCache<Jimp>();

  if (imageCache[layerContent.location]) {
    image = await Jimp.read(imageCache[layerContent.location]);
  } else {
    image = await Jimp.read(layerContent.location);
    image.clone((_err: any, clone: Jimp) => {
      if (layerContent.location) imageCache[layerContent.location] = clone;
    });
  }

  return image;
};

const renderLayer = async (
  workflow: Workflow,
  layer: Layer | LayerMask
): Promise<{ image: Jimp; pos: { x: number; y: number } } | null> => {
  let layerContent: Jimp | null = null;

  switch (layer.content?.type) {
    case "image":
      layerContent = await getImageLayerContent(layer.content);
      break;

    case "solid":
      layerContent = await getSolidLayerContent(layer.content, workflow);
      break;

    case "gradient":
      layerContent = await getGradientLayerContent(layer.content, workflow);
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

const getSolidLayerContent = async (
  layerContent: SolidLayerContent,
  workflow: Workflow
): Promise<Jimp | null> => {
  if (!layerContent.color) {
    return null;
  }

  const image = await Jimp.create(1, 1);
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

const getGradientLayerContent = async (
  layerContent: GradientLayerContent,
  workflow: Workflow
): Promise<any> => {
  if (!layerContent.color?.from || !layerContent.color?.to) {
    return;
  }

  const start = {
    x: layerContent.pos?.from?.x ?? 0,
    y: layerContent.pos?.from?.y ?? 0,
  };
  const end = {
    x: layerContent.pos?.to?.x ?? 0,
    y: layerContent.pos?.to?.y ?? workflow.size.height,
  };
  const line = equationOfLineFromPoints(start, end);

  const fromColor = layerContent.color!.from!;
  const toColor = layerContent.color!.to!;

  const image = await Jimp.create(workflow.size.width, workflow.size.height);

  for (let x = 0; x < workflow.size.width; x++) {
    for (let y = 0; y < workflow.size.height; y++) {
      const perpendicular = equationOfPerpendicularLine(line, {
        x,
        y,
      });
      const intersection = intersectionOfTwoLines(line, perpendicular);
      const gradientRatio = getRatioOfPointAlongLine(line, intersection);

      const r = fromColor.r + (toColor.r - fromColor.r) * gradientRatio;
      const g = fromColor.g + (toColor.g - fromColor.g) * gradientRatio;
      const b = fromColor.b + (toColor.b - fromColor.b) * gradientRatio;
      const a = 255 * (fromColor.a + (toColor.a - fromColor.a) * gradientRatio);

      image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
    }
  }

  return image;
};
