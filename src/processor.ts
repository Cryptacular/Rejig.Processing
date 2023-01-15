import Jimp from "jimp";
import { Workflow, validate } from "./models/Workflow";
import { getJimpBlendingMode } from "./utilities/getJimpBlendingMode";
import { renderLayer } from "./layerContent";
import { Layer } from "./models/Layer";
import { Position } from "./models/Position";

export const processWorkflow = async (workflow: Workflow): Promise<Jimp> => {
  await validate(workflow);

  const output = await Jimp.create(workflow.size.width, workflow.size.height);

  const layers = workflow.layers?.length ? [...workflow.layers].reverse() : [];

  const layersToComposite: LayerToComposite[] = [];

  for (let layer of layers) {
    const renderedLayer = await renderLayer(workflow, layer);

    if (!renderedLayer) {
      continue;
    }

    let { image } = renderedLayer;

    if (layer.mask) {
      const mask = await renderLayer(workflow, layer.mask);
      image = mask ? image.mask(mask.image, mask.pos.x, mask.pos.y) : image;
    }

    layersToComposite.push({
      image,
      blendingMode: layer.blendingMode,
      pos: renderedLayer.pos,
      opacity: layer.opacity,
    });
  }

  for (let layer of layersToComposite) {
    const blendingMode = getJimpBlendingMode(layer.blendingMode);

    try {
      let { pos, image } = layer;
      output.composite(image, pos.x || 0, pos.y || 0, {
        mode: blendingMode,
        opacitySource: layer.opacity! / 100,
        opacityDest: 1,
      });
    } catch (e) {
      throw new Error(`Could not perform operation: ${e}`);
    }
  }

  return output;
};

interface LayerToComposite {
  image: Jimp;
  blendingMode: Layer["blendingMode"];
  pos: Position;
  opacity: Layer["opacity"];
}
