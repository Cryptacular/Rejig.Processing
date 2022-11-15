import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { ImageLayerContent } from "./ImageLayerContent";
import { Layer } from "./Layer";
import { SolidLayerContent } from "./SolidLayerContent";

export interface Parameter {
  id: string;
  name?: string;
  targetLayer?: string;
  targetProperty?: string;
  value?: string;
}

type ParameterKey =
  | keyof Omit<Layer, "id" | "name" | "content">
  | `content.${keyof Omit<ImageLayerContent, "type">}`
  | `content.${keyof Omit<SolidLayerContent, "type">}`
  | undefined;

const targetPropertySchema: yup.StringSchema<ParameterKey> = yup
  .string()
  .oneOf([
    "position",
    "origin",
    "alignment",
    "placement",
    "scale",
    "opacity",
    "content.location",
    "content.color",
  ]);

export const parameterSchema: yup.ObjectSchema<Parameter> = yup.object({
  id: yup.string().default(() => uuidv4()),
  name: yup.string(),
  targetLayer: yup.string(),
  targetProperty: targetPropertySchema,
  value: yup.string(),
});

export const getDefaultParameter = (
  properties?: Partial<Parameter>
): Parameter => parameterSchema.cast(properties);
