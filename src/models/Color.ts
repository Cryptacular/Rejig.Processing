import * as yup from "yup";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const colorSchema: yup.ObjectSchema<Color> = yup.object({
  r: yup.number().integer().min(0).max(255).default(0),
  g: yup.number().integer().min(0).max(255).default(0),
  b: yup.number().integer().min(0).max(255).default(0),
  a: yup.number().min(0).max(1).default(1),
});
