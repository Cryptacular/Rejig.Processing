import Jimp from "jimp";
import { Workflow, validate } from "./models/Workflow";
import { getJimpBlendingMode } from "./utilities/getJimpBlendingMode";
import { renderLayer } from "./layerContent";
import { Layer } from "./models/Layer";

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

    const { pos } = renderedLayer;
    const { blendingMode, opacity, clippingMask } = layer;

    layersToComposite.push({
      image,
      blendingMode,
      pos,
      opacity,
      clippingMask,
    });
  }

  let highestLayerWithClippingMaskFalse = -1;

  await Promise.all(
    layersToComposite.map(async (layer, i) => {
      let { clippingMask } = layer;

      if (!clippingMask) {
        highestLayerWithClippingMaskFalse = i;
      }

      // Peek ahead to next layer
      const nextLayer =
        layersToComposite.length > i + 1 ? layersToComposite[i + 1] : null;

      // If next layer exists AND next layer is a clipping mask, skip this layer
      if (nextLayer && nextLayer.clippingMask) {
        return;
      }

      if (clippingMask && highestLayerWithClippingMaskFalse >= 0) {
        // If layer has clipping mask = true, find all layers below that have clipping mask = true + the layer below that
        const layersToCompositeWithClippingMask = layersToComposite.slice(
          highestLayerWithClippingMaskFalse,
          i + 1
        );

        // Create temporary Jimp image
        let tempOutput = await Jimp.create(
          workflow.size.width,
          workflow.size.height
        );

        // Composite lowest layer + clipping mask layers together
        for (let l of layersToCompositeWithClippingMask) {
          compositeLayers(tempOutput, l);
        }

        // Turn lowest layer into b&w layer based on alpha (make all pixels white, then add black background)
        const lowestLayer =
          layersToComposite[highestLayerWithClippingMaskFalse];

        // Use B&W image data as mask
        const blackLayer = (
          await Jimp.create(workflow.size.width, workflow.size.height, 0)
        ).opaque();
        tempOutput.mask(
          blackLayer.composite(
            lowestLayer.image.scan(
              0,
              0,
              lowestLayer.image.bitmap.width,
              lowestLayer.image.bitmap.height,
              function (x, y, i) {
                var alpha = this.bitmap.data[i + 3];
                lowestLayer.image.setPixelColor(
                  Jimp.rgbaToInt(255, 255, 255, alpha),
                  x,
                  y
                );
              }
            ),
            0,
            0
          ),
          0,
          0
        );

        // Composite with `output`
        compositeLayers(output, {
          image: tempOutput,
          blendingMode: layer.blendingMode,
          pos: { x: 0, y: 0 },
          opacity: layer.opacity,
          clippingMask: false,
        });
      } else {
        compositeLayers(output, layer);
      }
    })
  );

  return output;
};

const compositeLayers = (output: Jimp, layer: LayerToComposite) => {
  let { image, pos } = layer;
  const blendingMode = getJimpBlendingMode(layer.blendingMode);

  try {
    output.composite(image, pos?.x || 0, pos?.y || 0, {
      mode: blendingMode,
      opacitySource: layer.opacity! / 100,
      opacityDest: 1,
    });
  } catch (e) {
    throw new Error(`Could not perform operation: ${e}`);
  }
};

interface LayerToComposite {
  image: Jimp;
  blendingMode: Layer["blendingMode"];
  pos: Layer["position"];
  opacity: Layer["opacity"];
  clippingMask: Layer["clippingMask"];
}
