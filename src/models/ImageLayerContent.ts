import * as yup from "yup";
import { LayerContent } from "./LayerContent";

export interface ImageLayerContent extends LayerContent {
  type: "image";
  location?: string;
}

export const imageLayerContentSchema: yup.ObjectSchema<ImageLayerContent> =
  yup.object({
    type: yup.string().oneOf(["image"]).default("image").required(),
    location: yup.string().url(),
  });

export const getDefaultImageLayerContent = (
  properties?: Partial<ImageLayerContent>
): ImageLayerContent => imageLayerContentSchema.cast(properties);
