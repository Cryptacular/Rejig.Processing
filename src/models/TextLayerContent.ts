import * as yup from "yup";
import { Color, colorSchema } from "./Color";
import { LayerContent } from "./LayerContent";

export interface TextLayerContent extends LayerContent {
  type: "text";
  text?: string;
  font?: string;
  size?: number;
  color?: Color;
}

export const textLayerContentSchema: yup.ObjectSchema<TextLayerContent> =
  yup.object({
    type: yup.string().oneOf(["text"]).default("text").required(),
    text: yup.string(),
    font: yup.string(),
    size: yup.number().min(0),
    color: colorSchema,
  });

export const getDefaultTextLayerContent = (
  properties?: Partial<TextLayerContent>
): TextLayerContent => textLayerContentSchema.cast(properties);
