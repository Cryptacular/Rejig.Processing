import * as yup from "yup";
import { Color, colorSchema } from "./Color";
import { LayerContent } from "./LayerContent";

export interface SolidLayerContent extends LayerContent {
  type: "solid";
  color?: Color;
}

export const solidLayerContentSchema: yup.ObjectSchema<SolidLayerContent> =
  yup.object({
    type: yup.string().oneOf(["solid"]).default("solid").required(),
    color: colorSchema,
  });

export const getDefaultSolidLayerContent = (
  properties?: Partial<SolidLayerContent>
): SolidLayerContent => solidLayerContentSchema.cast(properties);
