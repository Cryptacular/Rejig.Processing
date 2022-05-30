import { v4 as uuidv4 } from "uuid";

export interface Parameter {
  id: string;
  name: string;
  targetLayer?: string;
  targetProperty?: string;
  value?: string;
}

export const getDefaultParameter = (
  properties?: Partial<Parameter>
): Parameter => ({
  id: properties?.id ?? uuidv4(),
  name: properties?.name ?? "parameter",
  targetLayer: properties?.targetLayer,
  targetProperty: properties?.targetProperty,
  value: properties?.value,
});
