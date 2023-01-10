import * as yup from "yup";

export type Origin =
  | "top left"
  | "top center"
  | "top right"
  | "center left"
  | "center center"
  | "center right"
  | "bottom left"
  | "bottom center"
  | "bottom right"
  | string
  | undefined;

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

export const originSchema: yup.StringSchema<Origin> = yup
  .string()
  .oneOf(validDescriptors);

export const getDefaultOrigin = (property?: Origin): Origin =>
  property ?? "top left";
