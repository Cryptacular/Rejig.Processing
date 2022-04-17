let imageCache: Record<string, any>;

export const getCache = <T>() => {
  imageCache = imageCache || {};
  return imageCache as Record<string, T>;
};

export const flushCache = () => {
  Object.keys(imageCache).forEach((key) => delete imageCache[key]);
};
