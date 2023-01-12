import Jimp from "jimp";
import { getCache } from "../cache";
import { ImageLayerContent } from "../models/ImageLayerContent";

export const getImageLayerContent = async (
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
