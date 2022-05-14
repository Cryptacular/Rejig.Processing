import { Color } from "./Color";
import { Dimensions } from "./Dimensions";
import { LayerContent } from "./LayerContent";

export interface SolidLayerContent extends LayerContent {
  type: "solid";
  color?: Color;
  size?: Dimensions;
}

export const getDefaultSolidLayerContent = (
  properties?: Partial<SolidLayerContent>
): SolidLayerContent => ({
  type: "solid",
  color: properties?.color,
  size: properties?.size,
});
