import { LayerContent } from "./LayerContent";
import { Origin } from "./Origin";
import { Position } from "./Position";
import { Scale } from "./Scale";

export interface Layer {
  id: string;
  name: string;
  content: LayerContent;
  position: Position;
  origin: Origin;
  alignment: Origin;
  scale: Scale;
  opacity: number;
}
