import { Dimensions } from "./Dimensions";
import { Layer } from "./Layer";
import { Parameter } from "./Parameter";

export interface Workflow {
  id: string;
  size: Dimensions;
  name: string;
  authorId: string;
  layers: Layer[];
  parameters?: Parameter[];
  remixedFrom: string | null;
  created: Date;
  modified: Date;
}
