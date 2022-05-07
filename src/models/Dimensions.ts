export interface Dimensions {
  width: number;
  height: number;
}

export const getDefaultDimensions = (
  properties?: Partial<Dimensions>
): Dimensions => ({
  width: properties?.width ?? 512,
  height: properties?.height ?? 256,
});
