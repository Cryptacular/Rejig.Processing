import { Workflow, getDefaultWorkflow, validate } from "../models/Workflow";

export const applyParameters = async (
  workflow: Workflow
): Promise<Workflow> => {
  if (!workflow.parameters || workflow.parameters.length === 0) {
    return workflow;
  }

  const workflowWithAppliedParameters: typeof workflow = getDefaultWorkflow({
    ...(JSON.parse(JSON.stringify(workflow)) as Workflow),
    parameters: [],
  });

  await validate(workflowWithAppliedParameters);

  for (let parameter of workflow.parameters) {
    if (
      !parameter.targetLayer ||
      !parameter.targetProperty ||
      !parameter.value
    ) {
      continue;
    }

    const layerId = parameter.targetLayer;
    const layer = workflowWithAppliedParameters.layers?.find(
      (x) => x.id === layerId
    ) as any;

    const targetProperty = parameter.targetProperty.split(".");
    let tempLayer: any = layer;

    targetProperty.forEach((p, i, arr) => {
      if (!tempLayer || !parameter.value) {
        return;
      }

      if (i === arr.length - 1) {
        const propertyType = typeof tempLayer[p];

        switch (propertyType) {
          case "number":
          case "bigint":
            tempLayer[p] =
              parameter.value.indexOf(".") < 0
                ? parseInt(parameter.value)
                : parseFloat(parameter.value);
            break;

          case "boolean":
            tempLayer[p] = parameter.value !== "false";
            break;

          case "object":
            tempLayer[p] = JSON.parse(parameter.value);
            break;

          default:
            tempLayer[p] = parameter.value;
        }

        return;
      }

      tempLayer = tempLayer[p];
    });
  }

  return workflowWithAppliedParameters;
};
