import * as yup from "yup";
import { ImageLayerContent } from "./ImageLayerContent";
import { Origin, originSchema } from "./Origin";
import { Position, positionSchema } from "./Position";
import { Scale, scaleSchema } from "./Scale";
import { v4 as uuidv4 } from "uuid";
import { SolidLayerContent } from "./SolidLayerContent";
import { layerContentSchema } from "./LayerContent";

export interface Layer {
  id?: string;
  name?: string;
  content?: ImageLayerContent | SolidLayerContent;
  position?: Position;
  origin?: Origin;
  alignment?: Origin;
  placement?: "custom" | "cover" | "fit" | "stretch";
  scale?: Scale;
  opacity?: number;
}

export const layerSchema: yup.ObjectSchema<Layer> = yup.object({
  id: yup.string().default(() => uuidv4()),
  name: yup.string(),
  content: layerContentSchema,
  position: positionSchema,
  origin: originSchema,
  alignment: originSchema,
  placement: yup
    .string()
    .oneOf(["custom", "cover", "fit", "stretch"])
    .default("custom"),
  scale: scaleSchema,
  opacity: yup.number().min(0).max(100).default(100),
});

export const getDefaultLayer = (properties?: Partial<Layer>): Layer =>
  layerSchema.cast(properties);
