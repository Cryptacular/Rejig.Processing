import { Color } from "./Color";
import { LayerContent } from "./LayerContent";

export interface SolidLayerContent extends LayerContent {
  type: "solid";
  color?: Color;
}

export const getDefaultSolidLayerContent = (
  properties?: Partial<SolidLayerContent>
): SolidLayerContent => ({
  type: "solid",
  color: properties?.color,
});
