import * as yup from "yup";
import {
  getDefaultGradientLayerContent,
  GradientLayerContent,
} from "./GradientLayerContent";
import {
  getDefaultImageLayerContent,
  ImageLayerContent,
} from "./ImageLayerContent";
import {
  getDefaultSolidLayerContent,
  SolidLayerContent,
} from "./SolidLayerContent";
import {
  getDefaultWorkflowLayerContent,
  WorkflowLayerContent,
} from "./WorkflowLayerContent";

export interface LayerContent {
  type: "image" | "solid" | "gradient" | "workflow";
}

export const layerContentSchema = yup.object({
  type: yup
    .string()
    .oneOf(["image", "solid", "gradient", "workflow"])
    .default("solid")
    .required(),
});

export const getDefaultLayerContent = (
  properties?: Partial<LayerContent>
): LayerContent => {
  switch (properties?.type) {
    case "image":
      return getDefaultImageLayerContent(
        properties as Partial<ImageLayerContent>
      );

    case "solid":
      return getDefaultSolidLayerContent(
        properties as Partial<SolidLayerContent>
      );

    case "gradient":
      return getDefaultGradientLayerContent(
        properties as Partial<GradientLayerContent>
      );

    case "workflow":
      return getDefaultWorkflowLayerContent(
        properties as Partial<WorkflowLayerContent>
      );

    default:
      return {
        type: properties?.type ?? "image",
      };
  }
};
