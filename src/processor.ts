import { Workflow, validate } from "./models/Workflow";
import Jimp from "jimp";
import { getJimpBlendingMode } from "./utilities/getJimpBlendingMode";
import { renderLayer } from "./layerContent";

export const processWorkflow = async (workflow: Workflow): Promise<string> => {
  await validate(workflow);

  const output = await Jimp.create(workflow.size.width, workflow.size.height);

  const layers =
    workflow.layers && workflow.layers.length
      ? [...workflow.layers].reverse()
      : [];

  for (let layer of layers) {
    const renderedLayer = await renderLayer(workflow, layer);

    if (!renderedLayer) {
      continue;
    }

    const blendingMode = getJimpBlendingMode(layer.blendingMode);
    let { image } = renderedLayer;

    if (layer.mask) {
      const mask = await renderLayer(workflow, layer.mask);
      image = mask ? image.mask(mask.image, mask.pos.x, mask.pos.y) : image;
    }

    try {
      let { pos } = renderedLayer;
      output.composite(image, pos.x, pos.y, {
        mode: blendingMode,
        opacitySource: layer.opacity! / 100,
        opacityDest: 1,
      });
    } catch (e) {
      throw new Error(`Could not perform operation: ${e}`);
    }
  }

  return await output.getBase64Async(output.getMIME());
};
