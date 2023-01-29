import * as yup from "yup";
import { LayerContent } from "./LayerContent";

export interface WorkflowLayerContent extends LayerContent {
  type: "workflow";
  workflow?: string;
}

export const workflowLayerContentSchema: yup.ObjectSchema<WorkflowLayerContent> =
  yup.object({
    type: yup.string().oneOf(["workflow"]).default("workflow").required(),
    workflow: yup
      .string()
      .matches(
        new RegExp(/^[a-z0-9-]+(:[a-z0-9.]{1,})?$/),
        "Workflow should match format 'username/workflow' or 'username/workflow:tag'"
      ),
  });

export const getDefaultWorkflowLayerContent = (
  properties?: Partial<WorkflowLayerContent>
): WorkflowLayerContent => workflowLayerContentSchema.cast(properties);
