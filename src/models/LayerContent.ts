export interface LayerContent {
  type: "image";
  location?: string;
}

export const getDefaultLayerContent = (
  properties?: Partial<LayerContent>
): LayerContent => ({
  type: properties?.type ?? "image",
  location: properties?.location,
});
