import * as yup from "yup";

export interface Scale {
  x: number;
  y: number;
}

export const scaleSchema: yup.ObjectSchema<Scale> = yup.object({
  x: yup.number().default(1),
  y: yup.number().default(1),
});

export const getDefaultScale = (properties?: Partial<Scale>): Scale =>
  scaleSchema.cast(properties);
