import Jimp from "jimp";
import path from "path";
import fs from "fs";
import { processWorkflow } from "../src/processor";
import { getDefaultWorkflow } from "../src/models/Workflow";
import { getDefaultLayer } from "../src/models/Layer";
import { getDefaultSolidLayerContent } from "../src/models/SolidLayerContent";
import { getDefaultImageLayerContent } from "../src/models/ImageLayerContent";
import {
  getDefaultGradientLayerContent,
  GradientLayerContent,
} from "../src/models/GradientLayerContent";
import { Origin } from "../src/models/Origin";

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

  it("returns a BASE64 string of type PNG when given a default workflow", async () => {
    const workflow = getDefaultWorkflow();

    const image = await processWorkflow(workflow);

    expect(image).not.toBeNull();
    expect(image).toContain("data:image/png;base64");
  });

  it("returns an image of the right size when given a valid workflow", async () => {
    const workflow = getDefaultWorkflow({ size: { width: 10, height: 20 } });

    const image = await processWorkflow(workflow);

    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    expect(imageAsJimp.getWidth()).toBe(10);
    expect(imageAsJimp.getHeight()).toBe(20);
  });

  describe("[placement]", () => {
    it("correctly places image when using 'cover' with landscape output", async () => {
      const workflow = getDefaultWorkflow({
        size: { width: 200, height: 100 },
        layers: [
          getDefaultLayer({
            placement: "cover",
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
            content: getDefaultSolidLayerContent({
              color: { r: 255, g: 0, b: 0, a: 0.39 },
            }),
          }),
          getDefaultLayer({
            placement: "cover",
            origin: { descriptor: "center center" },
            alignment: { descriptor: "center center" },
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
  });

  describe("[origin] and [alignment]", () => {
    const allDescriptors: Origin["descriptor"][] = [
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
                origin: { descriptor: origin },
                alignment: { descriptor: alignment },
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
            origin: { descriptor: "bottom right" },
            alignment: { descriptor: "bottom right" },
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
});

const deleteArtifacts = () => {
  try {
    fs.readdirSync(path.resolve("./test/artifacts"));
  } catch {
    return;
  }

  fs.rmSync(path.resolve("./test/artifacts"), { recursive: true });
};

const saveArtifact = async (image: any, name: string) => {
  const buffer = Buffer.from(image.split(",")[1], "base64");
  const imageAsJimp = await Jimp.read(buffer);
  await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${name}.png`));
};

const diffPercentage = async (name: string) => {
  const expected = await Jimp.read(path.resolve(`./test/expected/${name}.png`));
  const actual = await Jimp.read(path.resolve(`./test/artifacts/${name}.png`));
  return Jimp.diff(expected, actual).percent;
};
