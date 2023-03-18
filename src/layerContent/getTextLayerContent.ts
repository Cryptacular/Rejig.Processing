import { createCanvas } from "canvas";
import Jimp from "jimp";
import { TextLayerContent } from "../models/TextLayerContent";
import { Workflow } from "../models/Workflow";

export const getTextLayerContent = async (
  layerContent: TextLayerContent,
  workflow: Workflow
): Promise<Jimp | null> => {
  if (!layerContent.text) {
    return null;
  }

  const canvas = createCanvas(workflow.size.width, workflow.size.height);
  const ctx = canvas.getContext("2d");

  // ctx.font = `${layerContent.size ?? 14}px ${layerContent.font ?? "Arial"}`;
  ctx.fillText(layerContent.text, 0, 0);

  const png = canvas.toBuffer();

  const image = await Jimp.create(png);
  console.log(image.getWidth());
  console.log(image.getHeight());
  return image;
};
