import * as yup from "yup";
import { Layer } from "./Layer";
import { layerContentSchema } from "./LayerContent";
import { originSchema } from "./Origin";
import { positionSchema } from "./Position";
import { scaleSchema } from "./Scale";

export interface LayerMask {
  content?: Layer["content"];
  position?: Layer["position"];
  origin?: Layer["origin"];
  alignment?: Layer["alignment"];
  placement?: Layer["placement"];
  scale?: Layer["scale"];
}

export const layerMaskSchema: yup.ObjectSchema<LayerMask> = yup.object({
  content: layerContentSchema,
  position: positionSchema.default({ x: 0, y: 0 }),
  origin: originSchema,
  alignment: originSchema,
  placement: yup
    .string()
    .oneOf(["custom", "cover", "fit", "stretch"])
    .default("custom"),
  scale: scaleSchema,
});

export const getDefaultLayerMask = (
  properties?: Partial<LayerMask>
): LayerMask => layerMaskSchema.cast(properties);
