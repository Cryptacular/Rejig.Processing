import Jimp from "jimp";
import fs from "node:fs";
import path from "node:path";
import { REJIG_BASE_URL } from "../constants/urls";
import { getDefaultWorkflow, Workflow } from "../models/Workflow";
import { WorkflowLayerContent } from "../models/WorkflowLayerContent";
import { IProcessWorkflowOptions, processWorkflow } from "../processor";
import { get } from "../utilities/httpClient";

export const getWorkflowLayerContent = async (
  layerContent: WorkflowLayerContent,
  options?: IProcessWorkflowOptions
): Promise<Jimp | null> => {
  if (!layerContent.workflow) {
    return null;
  }

  let workflow: Workflow | null = null;
  const shouldCheckLocalCache =
    options?.cacheDir !== undefined && options.cacheDir.length > 0;

  if (shouldCheckLocalCache) {
    const [workflowName, workflowTag] = hasWorkflowNameGotTag(
      layerContent.workflow
    )
      ? layerContent.workflow.split(":")
      : [layerContent.workflow, "latest"];

    const baseFolder = `${options.cacheDir}/workflows/${workflowName}`;
    const filePath = path.resolve(`${baseFolder}/${workflowTag}.json`);

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      workflow = JSON.parse(fileContents);
    }
  }

  if (!workflow) {
    workflow = await get(
      `${REJIG_BASE_URL}/api/user/${layerContent.workflow}/manifest`
    );
  }

  if (!workflow) {
    throw new Error(`Something went wrong.`);
  }

  return await processWorkflow(getDefaultWorkflow(workflow));
};

const hasWorkflowNameGotTag = (name: string): boolean => name.includes(":");
