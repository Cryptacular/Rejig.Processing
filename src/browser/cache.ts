import Jimp from "jimp/browser/lib/jimp";

export const imageCache: Record<string, Jimp> = {};

export const flushCache = () => {
  Object.keys(imageCache).forEach((key) => delete imageCache[key]);
};
