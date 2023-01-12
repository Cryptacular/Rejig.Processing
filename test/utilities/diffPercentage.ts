import path from "path";
import Jimp from "jimp";

export const diffPercentage = async (name: string, format: string = "png") => {
  const expected = await Jimp.read(
    path.resolve(`./test/expected/${name}.${format}`)
  );
  const actual = await Jimp.read(
    path.resolve(`./test/artifacts/${name}.${format}`)
  );
  return Jimp.diff(expected, actual).percent;
};
