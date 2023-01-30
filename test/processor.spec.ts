import Jimp from "jimp";
import path from "path";
import fs from "fs";
import { processWorkflow } from "../src/processor";
import { getDefaultWorkflow, Workflow } from "../src/models/Workflow";
import { getDefaultLayer, Layer } from "../src/models/Layer";
import { getDefaultSolidLayerContent } from "../src/models/SolidLayerContent";
import { getDefaultImageLayerContent } from "../src/models/ImageLayerContent";
import { getDefaultGradientLayerContent } from "../src/models/GradientLayerContent";
import { Origin } from "../src/models/Origin";
import { saveImage } from "../src/utilities/saveImage";
import { diffPercentage } from "./utilities/diffPercentage";
import { get } from "../src/utilities/httpClient";

jest.mock("../src/utilities/httpClient");

describe("Processor", () => {
  beforeAll(() => {
    deleteArtifacts();
  });

  it("throws when processing an empty workflow", async () => {
    const workflow = {};
    let error = null;

    try {
      await processWorkflow(workflow as any);
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
  });

  it("returns an image of the right size when given a valid workflow", async () => {
    const workflow = getDefaultWorkflow({ size: { width: 10, height: 20 } });

    const image = await processWorkflow(workflow);

    expect(image.getWidth()).toBe(10);
    expect(image.getHeight()).toBe(20);
  });

  describe("[workflow]", () => {
    it("does nothing if 'workflow' is not set", async () => {
      const workflow = getDefaultWorkflow({
        layers: [{ content: { type: "workflow" } }],
      });

      const image = await processWorkflow(workflow);
      const filename = "workflow-content-workflow-not-set";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("throws an error if workflow name is not valid", async () => {
      const workflow = getDefaultWorkflow({
        layers: [
          {
            content: {
              type: "workflow",
              workflow: "NOT_A_VALID_WORKFLOW_NAME",
            },
          },
        ],
      });

      let error = null;
      try {
        await processWorkflow(workflow);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
    });

    it("pulls and processes workflow as a layer when workflow name is valid and exists", async () => {
      (get as any).mockResolvedValue({
        size: { width: 50, height: 50 },
        layers: [{ content: getDefaultGradientLayerContent() }],
      });
      const workflow = getDefaultWorkflow({
        layers: [
          {
            content: { type: "workflow", workflow: "user/workflow:1" },
          },
          {
            content: { type: "workflow", workflow: "user/workflow" },
            origin: "bottom right",
            alignment: "bottom right",
          },
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "workflow-content-valid-workflow-name";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("pulls workflow from local folder if it exists and cache directory is provided", async () => {
      const workflow = getDefaultWorkflow({
        layers: [
          {
            content: { type: "workflow", workflow: "user/local" },
          },
        ],
      });

      const image = await processWorkflow(workflow, {
        cacheDir: "./test/cache",
      });
      const filename = "workflow-content-local-cache";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[clippingMask]", () => {
    it("does nothing if clippingMask is not set", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve(
                "./test/images/white-square-on-transparent-bg.png"
              ),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-not-set";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("does nothing if clippingMask is set to false", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
            clippingMask: false,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve(
                "./test/images/white-square-on-transparent-bg.png"
              ),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-false";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("renders layer normally if there is no layer underneath", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
            clippingMask: true,
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-solid-with-no-layer-underneath";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("sets layer opacity to be the same as the layer underneath when set to true", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
            clippingMask: true,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve(
                "./test/images/white-square-on-transparent-bg.png"
              ),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-solid-on-square-with-alpha";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("clips layer correctly without artifacts around aliased edges from layer underneath", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
            clippingMask: true,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/circle-512x512.png"),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-solid-on-circle-with-alpha";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("clips layer correctly when layer underneath is dark", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: { type: "solid", color: { r: 255, g: 0, b: 0, a: 1 } },
            clippingMask: true,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/circle-blue-512x512.png"),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-solid-on-dark-circle-with-alpha";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("clips all layers that have clippingMask set to true to the layer underneath them all", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 512, height: 512 },
        layers: [
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/circle-blue-512x512.png"),
            },
            scale: { x: 0.5, y: 0.5 },
            origin: "bottom right",
            alignment: "bottom right",
            clippingMask: true,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/circle-pink-512x512.png"),
            },
            scale: { x: 0.5, y: 0.5 },
            origin: "top left",
            alignment: "top left",
            clippingMask: true,
          }),
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/circle-512x512.png"),
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "clipping-mask-multiple-layers-on-circle-with-alpha";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[placement]", () => {
    it("correctly places image when using 'cover' with landscape output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            placement: "cover",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "cover-landscape-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when using 'cover' with portrait output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 100, height: 200 },
        layers: [
          getDefaultLayer({
            placement: "cover",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "cover-portrait-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when using 'fit' with landscape output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            placement: "fit",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "fit-landscape-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when using 'fit' with portrait output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 100, height: 200 },
        layers: [
          getDefaultLayer({
            placement: "fit",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "fit-portrait-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when using 'stretch' with landscape output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            placement: "stretch",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "stretch-landscape-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when using 'stretch' with portrait output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 100, height: 200 },
        layers: [
          getDefaultLayer({
            placement: "stretch",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "stretch-portrait-center-center";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[solid]", () => {
    it("creates image with solid red fill when using 'solid' layer content", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultSolidLayerContent({
              color: { r: 255, g: 0, b: 0, a: 1 },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "solid-red-full";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with solid green fill when using 'solid' layer content", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultSolidLayerContent({
              color: { r: 0, g: 255, b: 0, a: 1 },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "solid-green-full";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with solid blue fill when using 'solid' layer content", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultSolidLayerContent({
              color: { r: 0, g: 0, b: 255, a: 1 },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "solid-blue-full";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with semi-transparent fill of grey color when using 'solid' layer content", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultSolidLayerContent({
              color: { r: 127, g: 127, b: 127, a: 0.5 },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "solid-grey-semi-transparent";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly overlays solid layer type over image layer type", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            origin: "center center",
            alignment: "center center",
            content: getDefaultSolidLayerContent({
              color: { r: 255, g: 0, b: 0, a: 0.39 },
            }),
          }),
          getDefaultLayer({
            placement: "cover",
            origin: "center center",
            alignment: "center center",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/400x400.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "image-and-solid";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[gradient]", () => {
    it("creates image with default gradient when only 'type' is specified", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [{ content: { type: "gradient" } }],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-basic";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with default gradient", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent(),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-default";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with gradient of specified colours", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              color: {
                from: { r: 0, g: 0, b: 255, a: 1 },
                to: { r: 255, g: 122, b: 0, a: 1 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-blue-orange";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with gradient of specified colours with alpha", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              color: {
                from: { r: 0, g: 0, b: 255, a: 0.7 },
                to: { r: 255, g: 122, b: 0, a: 0.1 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-blue-orange-alpha";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with a linear gradient using specified position (vertical)", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              pos: {
                from: { x: 0, y: 40 },
                to: { x: 0, y: 80 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-y-40-80";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with a linear gradient using inverted position (bottom to top)", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              pos: {
                from: { x: 0, y: 80 },
                to: { x: 0, y: 40 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-y-80-40";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with a linear gradient using angled position (bottom-right to top-left)", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              pos: {
                from: { x: 160, y: 80 },
                to: { x: 40, y: 40 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-from-160-80-to-40-40";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with default gradient when only 'type' and 'direction' is specified", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: { type: "gradient", direction: "radial" },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-radial-default";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with default gradient", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              direction: "radial",
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-radial-default-basic";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with gradient with specified position", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              direction: "radial",
              pos: {
                from: { x: 0, y: 0 },
                to: { x: 200, y: 100 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-radial-position";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with gradient with specified color", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              direction: "radial",
              color: {
                from: { r: 255, g: 0, b: 122, a: 1 },
                to: { r: 0, g: 122, b: 40, a: 0.2 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-radial-color";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("creates image with gradient with specified color and position", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            content: getDefaultGradientLayerContent({
              direction: "radial",
              color: {
                from: { r: 255, g: 0, b: 122, a: 1 },
                to: { r: 0, g: 122, b: 40, a: 0.2 },
              },
              pos: {
                from: { x: 0, y: 0 },
                to: { x: 200, y: 100 },
              },
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "gradient-radial-color-position";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[origin] and [alignment]", () => {
    const allDescriptors: Origin[] = [
      "top left",
      "top center",
      "top right",
      "center left",
      "center center",
      "center right",
      "bottom left",
      "bottom center",
      "bottom right",
    ];

    for (let origin of allDescriptors) {
      for (let alignment of allDescriptors) {
        it(`correctly places image with origin of '${origin}' and alignment of '${alignment}'`, async () => {
          const workflow = getDefaultWorkflow({
            size: { width: 100, height: 100 },
            layers: [
              getDefaultLayer({
                origin: origin,
                alignment: alignment,
                content: getDefaultImageLayerContent({
                  location: path.resolve("./test/images/50x50.jpeg"),
                }),
              }),
            ],
          });

          const image = await processWorkflow(workflow);
          const filename = `origin-alignment/origin[${origin}]-alignment[${alignment}]`;
          await saveArtifact(image, filename);

          expect(await diffPercentage(filename)).toBe(0);
        });
      }
    }
  });

  describe("[scale]", () => {
    it("correctly places image when scaling down", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 50, height: 50 },
        layers: [
          getDefaultLayer({
            scale: { x: 0.5, y: 0.5 },
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "scaled-down-50-percent";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when scaling down and specifying origin/alignment", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 50, height: 50 },
        layers: [
          getDefaultLayer({
            origin: "bottom right",
            alignment: "bottom right",
            scale: { x: 0.5, y: 0.5 },
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "scaled-down-50-percent-origin-alignment";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("correctly places image when scaling down and specifying position", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 50, height: 50 },
        layers: [
          getDefaultLayer({
            position: { x: 25, y: 10 },
            scale: { x: 0.5, y: 0.5 },
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "scaled-down-50-percent-position";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });

  describe("[blendingMode]", () => {
    it("should combine layers with no blending mode when not set", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 50, height: 50 },
        layers: [
          getDefaultLayer({
            scale: { x: 0.75, y: 0.75 },
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
          }),
          getDefaultLayer({
            scale: { x: 0.75, y: 0.75 },
            alignment: "bottom right",
            origin: "bottom right",
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "blending-mode-not-set";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("should work with opacity", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 50, height: 50 },
        layers: [
          getDefaultLayer({
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50_alt.jpeg"),
            }),
            placement: "cover",
            blendingMode: "multiply",
            opacity: 20,
          }),
          getDefaultLayer({
            content: getDefaultImageLayerContent({
              location: path.resolve("./test/images/50x50.jpeg"),
            }),
            placement: "cover",
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "blending-mode-opacity";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    const allBlendingModes: Layer["blendingMode"][] = [
      "normal",
      "multiply",
      "add",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "hardlight",
      "difference",
      "exclusion",
    ];

    for (let blendingMode of allBlendingModes) {
      it(`should combine layers with no blending mode when set to '${blendingMode}'`, async () => {
        const workflow = getDefaultWorkflow({
          size: { width: 50, height: 50 },
          layers: [
            getDefaultLayer({
              content: getDefaultImageLayerContent({
                location: path.resolve("./test/images/50x50_alt.jpeg"),
              }),
              placement: "cover",
              blendingMode: blendingMode,
            }),
            getDefaultLayer({
              content: getDefaultImageLayerContent({
                location: path.resolve("./test/images/50x50.jpeg"),
              }),
              placement: "cover",
            }),
          ],
        });

        const image = await processWorkflow(workflow);
        const filename = `blending-mode-${blendingMode}`;
        await saveArtifact(image, filename);

        expect(await diffPercentage(filename)).toBe(0);
      });
    }
  });

  describe("[mask]", () => {
    it("should apply black & white mask and hide center square", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 400, height: 400 },
        layers: [
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/400x400.jpeg"),
            },
            mask: {
              content: {
                type: "image",
                location: path.resolve(
                  "./test/images/black-square-on-white-bg.png"
                ),
              },
              placement: "cover",
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "mask-square-center-hidden";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });

    it("should apply white & transparent mask and hide outside of center square", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 400, height: 400 },
        layers: [
          getDefaultLayer({
            content: {
              type: "image",
              location: path.resolve("./test/images/400x400.jpeg"),
            },
            mask: {
              content: {
                type: "image",
                location: path.resolve(
                  "./test/images/white-square-on-transparent-bg.png"
                ),
              },
              placement: "cover",
            },
          }),
        ],
      });

      const image = await processWorkflow(workflow);
      const filename = "mask-square-outside-hidden";
      await saveArtifact(image, filename);

      expect(await diffPercentage(filename)).toBe(0);
    });
  });
});

const deleteArtifacts = () => {
  try {
    fs.readdirSync(path.resolve("./test/artifacts"));
  } catch {
    return;
  }

  fs.rmSync(path.resolve("./test/artifacts"), { recursive: true });
};

const saveArtifact = async (
  image: Jimp,
  name: string,
  format: Workflow["format"] = "png"
) => {
  await saveImage(image, path.resolve(`./test/artifacts/${name}.${format}`));
};

const mockHttpGet = (returnValue: any): void => {
  (get as any).mockResolvedValue(returnValue);
};
