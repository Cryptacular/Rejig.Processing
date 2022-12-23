import * as yup from "yup";
import { Color, colorSchema } from "./Color";
import { LayerContent } from "./LayerContent";
import { Position, positionSchema } from "./Position";

export interface GradientLayerContent extends LayerContent {
  type: "gradient";
  color?: {
    from?: Color;
    to?: Color;
  };
  pos?: { from?: Position; to?: Position };
  direction?: "linear";
}

export const GradientLayerContentSchema: yup.ObjectSchema<GradientLayerContent> =
  yup.object({
    type: yup.string().oneOf(["gradient"]).default("gradient").required(),
    color: yup.object({
      from: colorSchema.default({ r: 0, g: 0, b: 0, a: 1 }),
      to: colorSchema.default({ r: 255, g: 255, b: 255, a: 1 }),
    }),
    pos: yup.object({
      from: positionSchema,
      to: positionSchema,
    }),
    direction: yup.string().oneOf(["linear"]).default("linear"),
  });

export const getDefaultGradientLayerContent = (
  properties?: Partial<GradientLayerContent>
): GradientLayerContent => GradientLayerContentSchema.cast(properties);
