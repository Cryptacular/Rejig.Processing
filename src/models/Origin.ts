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
  | undefined;

export const originSchema = yup
  .string()
  .oneOf([
    "top left",
    "top center",
    "top right",
    "center left",
    "center center",
    "center right",
    "bottom left",
    "bottom center",
    "bottom right",
  ])
  .default("top left");

export const getDefaultOrigin = (property?: Origin): Origin =>
  property ?? "top left";
