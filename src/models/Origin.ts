import * as yup from "yup";

export interface Origin {
  descriptor:
    | "top left"
    | "top center"
    | "top right"
    | "center left"
    | "center center"
    | "center right"
    | "bottom left"
    | "bottom center"
    | "bottom right"
    | string;
}

const validDescriptors = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right",
];

export const originSchema: yup.ObjectSchema<Origin> = yup.object({
  descriptor: yup
    .string()
    .oneOf(validDescriptors)
    .default("top left")
    .required(),
});

export const getDefaultOrigin = (properties?: Partial<Origin>): Origin =>
  originSchema.cast(properties);
