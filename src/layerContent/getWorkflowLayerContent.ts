import Jimp from "jimp";
import { REJIG_BASE_URL } from "../constants/urls";
import { getDefaultWorkflow } from "../models/Workflow";
import { WorkflowLayerContent } from "../models/WorkflowLayerContent";
import { processWorkflow } from "../processor";
import { get } from "../utilities/httpClient";

export const getWorkflowLayerContent = async (
  layerContent: WorkflowLayerContent
): Promise<Jimp | null> => {
  if (!layerContent.workflow) {
    return null;
  }

  const workflow = await get(
    `${REJIG_BASE_URL}/api/workflow/${encodeURIComponent(
      layerContent.workflow
    )}`
  );

  if (!workflow) {
    throw new Error(`Something went wrong.`);
  }

  return await processWorkflow(getDefaultWorkflow(workflow));
};
