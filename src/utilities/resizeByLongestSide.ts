export const resizeByLongestSide = async (
  image: string,
  maxLengthOfLongestSide: number,
  jimp: any
): Promise<string> => {
  const buffer = Buffer.from(image.split(",")[1], "base64");
  const output = await jimp.read(buffer);

  const width = output.getWidth();
  const height = output.getHeight();

  if (width < maxLengthOfLongestSide && height < maxLengthOfLongestSide) {
    return image;
  }

  if (width > height) {
    output.resize(
      maxLengthOfLongestSide,
      height * (maxLengthOfLongestSide / width)
    );
  } else {
    output.resize(
      width * (maxLengthOfLongestSide / height),
      maxLengthOfLongestSide
    );
  }

  return await output.getBase64Async(output.getMIME());
};
