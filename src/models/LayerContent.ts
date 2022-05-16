import {
  getDefaultImageLayerContent,
  ImageLayerContent,
} from "./ImageLayerContent";
import {
  getDefaultSolidLayerContent,
  SolidLayerContent,
} from "./SolidLayerContent";

export interface LayerContent {
  type: "image" | "solid";
}

export const getDefaultLayerContent = (
  properties?: Partial<LayerContent>
): LayerContent => {
  switch (properties?.type) {
    case "image":
      return getDefaultImageLayerContent(
        properties as Partial<ImageLayerContent>
      );

    case "solid":
      return getDefaultSolidLayerContent(
        properties as Partial<SolidLayerContent>
      );

    default:
      return {
        type: properties?.type ?? "image",
      };
  }
};
