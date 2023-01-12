import Jimp from "jimp/*";
import path from "path";

export const saveImage = async (image: Jimp, filepath: string) => {
  await image.writeAsync(path.resolve(filepath));
};
