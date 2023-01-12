import Jimp from "jimp";
import { SolidLayerContent } from "../models/SolidLayerContent";
import { Workflow } from "../models/Workflow";

export const getSolidLayerContent = async (
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
