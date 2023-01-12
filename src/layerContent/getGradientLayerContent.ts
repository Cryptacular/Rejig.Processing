import Jimp from "jimp";
import { GradientLayerContent } from "../models/GradientLayerContent";
import { Workflow } from "../models/Workflow";
import {
  equationOfLineFromPoints,
  equationOfPerpendicularLine,
  intersectionOfTwoLines,
  getRatioOfPointAlongLine,
  getDistanceBetweenPoints,
  Point,
} from "../utilities/gradientCalculator";

export const getGradientLayerContent = async (
  layerContent: GradientLayerContent,
  workflow: Workflow
): Promise<any> => {
  if (!layerContent.color?.from || !layerContent.color?.to) {
    return;
  }

  const isLinear = layerContent.direction === "linear";
  const isRadial = layerContent.direction === "radial";

  const fromColor = layerContent.color!.from!;
  const toColor = layerContent.color!.to!;

  const image = await Jimp.create(workflow.size.width, workflow.size.height);

  if (isLinear) {
    const start = {
      x: layerContent.pos?.from?.x ?? 0,
      y: layerContent.pos?.from?.y ?? 0,
    };
    const end = {
      x: layerContent.pos?.to?.x ?? 0,
      y: layerContent.pos?.to?.y ?? workflow.size.height,
    };

    const line = equationOfLineFromPoints(start, end);

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
        const a =
          255 * (fromColor.a + (toColor.a - fromColor.a) * gradientRatio);

        image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
      }
    }
  }

  if (isRadial) {
    const start = {
      x: layerContent.pos?.from?.x ?? workflow.size.width / 2,
      y: layerContent.pos?.from?.y ?? workflow.size.height / 2,
    };
    const end = {
      x: layerContent.pos?.to?.x ?? workflow.size.width,
      y: layerContent.pos?.to?.y ?? workflow.size.height,
    };

    const lengthOfGradient = getDistanceBetweenPoints(start, end);

    for (let x = 0; x < workflow.size.width; x++) {
      for (let y = 0; y < workflow.size.height; y++) {
        const currentPoint: Point = { x, y };
        const distanceOfPointToCenter = getDistanceBetweenPoints(
          start,
          currentPoint
        );
        const gradientRatio = distanceOfPointToCenter / lengthOfGradient;

        const r = fromColor.r + (toColor.r - fromColor.r) * gradientRatio;
        const g = fromColor.g + (toColor.g - fromColor.g) * gradientRatio;
        const b = fromColor.b + (toColor.b - fromColor.b) * gradientRatio;
        const a =
          255 * (fromColor.a + (toColor.a - fromColor.a) * gradientRatio);

        image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
      }
    }
  }

  return image;
};
