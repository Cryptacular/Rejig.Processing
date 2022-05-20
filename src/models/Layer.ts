import { getDefaultLayerContent } from "./LayerContent";
import { ImageLayerContent } from "./ImageLayerContent";
import { getDefaultOrigin, Origin } from "./Origin";
import { getDefaultPosition, Position } from "./Position";
import { getDefaultScale, Scale } from "./Scale";
import { v4 as uuidv4 } from "uuid";
import { SolidLayerContent } from "./SolidLayerContent";

export interface Layer {
  id?: string;
  name: string;
  content: ImageLayerContent | SolidLayerContent;
  position: Position;
  origin: Origin;
  alignment: Origin;
  placement: "custom" | "cover" | "fit" | "stretch";
  scale: Scale;
  opacity: number;
}

export const getDefaultLayer = (properties?: Partial<Layer>): Layer => ({
  id: properties?.id ?? uuidv4(),
  name: properties?.name ?? properties?.content?.type ?? "layer",
  content: getDefaultLayerContent(properties?.content),
  position: getDefaultPosition(properties?.position),
  origin: getDefaultOrigin(properties?.origin),
  placement: properties?.placement ?? "custom",
  alignment: getDefaultOrigin(properties?.alignment),
  scale: getDefaultScale(properties?.scale),
  opacity: properties?.opacity ?? 100,
});
