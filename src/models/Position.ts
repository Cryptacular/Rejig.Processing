import * as yup from "yup";

export interface Position {
  x: number;
  y: number;
}

export const positionSchema: yup.ObjectSchema<Position> = yup.object({
  x: yup.number().default(0),
  y: yup.number().default(0),
});

export const getDefaultPosition = (properties?: Partial<Position>): Position =>
  positionSchema.cast(properties);
