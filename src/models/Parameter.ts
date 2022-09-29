import { v4 as uuidv4 } from "uuid";
import { ImageLayerContent } from "./ImageLayerContent";
import { Layer } from "./Layer";
import { SolidLayerContent } from "./SolidLayerContent";

export interface Parameter {
  id: string;
  name: string;
  targetLayer?: string;
  targetProperty?:
    | keyof Omit<Layer, "id" | "name" | "content">
    | `content.${keyof Omit<ImageLayerContent, "type">}`
    | `content.${keyof Omit<SolidLayerContent, "type">}`;
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
