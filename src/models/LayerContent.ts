import * as yup from "yup";
import {
  getDefaultImageLayerContent,
  ImageLayerContent,
} from "./ImageLayerContent";
import {
  getDefaultSolidLayerContent,
  SolidLayerContent,
} from "./SolidLayerContent";

export interface LayerContent {
  type: "image" | "solid" | "gradient";
}

export const layerContentSchema = yup.object({
  type: yup
    .string()
    .oneOf(["image", "solid", "gradient"])
    .default("solid")
    .required(),
});

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
