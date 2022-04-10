import { Dimensions } from "./Dimensions";
import { Layer } from "./Layer";

export interface Workflow {
  id: string;
  size: Dimensions;
  name: string;
  authorId: string;
  layers: Layer[];
  remixedFrom: string | null;
  created: Date;
  modified: Date;
}
