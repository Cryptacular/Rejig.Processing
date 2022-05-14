import { LayerContent } from "./LayerContent";

export interface ImageLayerContent extends LayerContent {
  type: "image";
  location?: string;
}

export const getDefaultImageLayerContent = (
  properties?: Partial<ImageLayerContent>
): ImageLayerContent => ({
  type: "image",
  location: properties?.location,
});
