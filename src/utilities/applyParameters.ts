import { EditWorkflow } from "../models/EditWorkflow";
import { Workflow } from "../models/Workflow";

export const applyParameters = (
  workflow: Workflow | EditWorkflow
): Workflow | EditWorkflow => {
  if (!workflow.parameters || workflow.parameters.length === 0) {
    return workflow;
  }

  const workflowWithAppliedParameters: typeof workflow = {
    ...workflow,
    parameters: [],
  };

  for (let parameter of workflow.parameters) {
    if (
      !parameter.targetLayer ||
      !parameter.targetProperty ||
      !parameter.value
    ) {
      continue;
    }

    const layerId = parameter.targetLayer;
    const layer = workflowWithAppliedParameters.layers.find(
      (x) => x.id === layerId
    ) as any;

    const targetProperty = parameter.targetProperty.split(".");
    let tempProperty: any = layer;

    targetProperty.forEach((p, i, arr) => {
      if (!tempProperty || !parameter.value) {
        return;
      }

      if (i === arr.length - 1) {
        const propertyType = typeof tempProperty[p];

        switch (propertyType) {
          case "number":
          case "bigint":
            tempProperty[p] =
              parameter.value.indexOf(".") < 0
                ? parseInt(parameter.value)
                : parseFloat(parameter.value);
            break;

          case "boolean":
            tempProperty[p] = parameter.value !== "false";
            break;

          default:
            tempProperty[p] = parameter.value;
        }

        return;
      }

      tempProperty = tempProperty[p];
    });
  }

  return workflowWithAppliedParameters;
};
