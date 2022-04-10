import { Dimensions } from "./Dimensions";
import { Layer } from "./Layer";

export interface EditWorkflow {
  id: string | null;
  authorId?: string;
  size: Dimensions;
  name: string;
  layers: Layer[];
  remixedFrom: string | null;
}
