import * as yup from "yup";
import { ImageLayerContent } from "./ImageLayerContent";
import { Origin, originSchema } from "./Origin";
import { Position, positionSchema } from "./Position";
import { Scale, scaleSchema } from "./Scale";
import { v4 as uuidv4 } from "uuid";
import { SolidLayerContent } from "./SolidLayerContent";
import { layerContentSchema } from "./LayerContent";
import { GradientLayerContent } from "./GradientLayerContent";
import { LayerMask, layerMaskSchema } from "./LayerMask";

export interface Layer {
  id?: string;
  name?: string;
  content?: ImageLayerContent | SolidLayerContent | GradientLayerContent;
  position?: Position;
  origin?: Origin;
  alignment?: Origin;
  placement?: "custom" | "cover" | "fit" | "stretch";
  scale?: Scale;
  opacity?: number;
  blendingMode?:
    | "normal"
    | "multiply"
    | "add"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "hardlight"
    | "difference"
    | "exclusion";
  mask?: LayerMask;
}

export const layerSchema: yup.ObjectSchema<Layer> = yup.object({
  id: yup.string().default(() => uuidv4()),
  name: yup.string(),
  content: layerContentSchema,
  position: positionSchema.default({ x: 0, y: 0 }),
  origin: originSchema,
  alignment: originSchema,
  placement: yup
    .string()
    .oneOf(["custom", "cover", "fit", "stretch"])
    .default("custom"),
  scale: scaleSchema,
  opacity: yup.number().min(0).max(100).default(100),
  blendingMode: yup
    .string()
    .oneOf([
      "normal",
      "multiply",
      "add",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "hardlight",
      "difference",
      "exclusion",
    ])
    .default("normal"),
  mask: layerMaskSchema,
});

export const getDefaultLayer = (properties?: Partial<Layer>): Layer =>
  layerSchema.cast(properties);
