import { getDefaultDimensions } from "./Dimensions";
import { getDefaultLayer } from "./Layer";
import { Workflow } from "./Workflow";

export interface EditWorkflow
  extends Omit<Workflow, "id" | "authorId" | "created" | "modified"> {
  id: string | null;
  authorId?: string;
}

export const getDefaultWorkflow = (
  properties?: Partial<EditWorkflow>
): EditWorkflow => ({
  id: properties?.id ?? null,
  authorId: properties?.authorId,
  size: getDefaultDimensions(properties?.size),
  name: properties?.name ?? "Untitled",
  layers: properties?.layers?.map((l) => getDefaultLayer(l)) ?? [],
  remixedFrom: properties?.remixedFrom ?? null,
});
