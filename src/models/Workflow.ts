import { Dimensions, dimensionsSchema } from "./Dimensions";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { Layer, layerSchema } from "./Layer";
import { Parameter, parameterSchema } from "./Parameter";

export interface Workflow {
  id?: string;
  authorId?: string;
  size: Dimensions;
  name?: string;
  format?: "png" | "jpg" | "jpeg" | "tiff" | "bmp";
  layers?: Layer[];
  parameters?: Parameter[];
  remixedFrom?: string | null;
  created?: Date;
  modified?: Date;
}

export const workflowSchema: yup.ObjectSchema<Workflow> = yup.object({
  id: yup.string().default(() => uuidv4()),
  authorId: yup.string(),
  size: dimensionsSchema.required(),
  name: yup.string().min(1),
  format: yup
    .string()
    .oneOf(["png", "jpg", "jpeg", "tiff", "bmp"])
    .default("png"),
  layers: yup.array().of(layerSchema).default([]),
  parameters: yup.array().of(parameterSchema).default([]),
  remixedFrom: yup.string().nullable(),
  created: yup.date().default(new Date()),
  modified: yup.date().default(new Date()),
});

export const getDefaultWorkflow = (properties?: Partial<Workflow>): Workflow =>
  workflowSchema.cast(properties);

export const validate = async (workflow: any) =>
  await workflowSchema.validate(workflow, { strict: true });

export const isValid = async (workflow: any) =>
  await workflowSchema.isValid(workflow, { strict: true });
