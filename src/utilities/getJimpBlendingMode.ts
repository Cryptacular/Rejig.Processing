import Jimp from "jimp";
import { Layer } from "../models/Layer";

export const getJimpBlendingMode = (
  blendingMode: Layer["blendingMode"]
): string => {
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
