import * as yup from "yup";

export interface Dimensions {
  width: number;
  height: number;
}

export const dimensionsSchema: yup.ObjectSchema<Dimensions> = yup.object({
  width: yup.number().min(0).default(512),
  height: yup.number().min(0).default(512),
});

export const getDefaultDimensions = (
  properties?: Partial<Dimensions>
): Dimensions => dimensionsSchema.cast(properties);
