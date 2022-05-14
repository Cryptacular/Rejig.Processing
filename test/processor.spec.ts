import Jimp from "jimp";
import path from "path";
import { processWorkflow } from "../src/processor";
import { getDefaultWorkflow } from "../src/models/EditWorkflow";
import { getDefaultLayer } from "../src/models/Layer";
import { getDefaultLayerContent } from "../src/models/LayerContent";
import { getDefaultSolidLayerContent } from "../src/models/SolidLayerContent";

describe("Processor", () => {
  it("returns a BASE64 string of type PNG when given a default workflow", async () => {
    const workflow = getDefaultWorkflow();

    const image = await processWorkflow(workflow, Jimp);

    expect(image).not.toBeNull();
    expect(image).toContain("data:image/png;base64");
  });

  it("returns an image of the right size when given a valid workflow", async () => {
    const workflow = getDefaultWorkflow({ size: { width: 10, height: 20 } });

    const image = await processWorkflow(workflow, Jimp);

    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    expect(imageAsJimp.getWidth()).toBe(10);
    expect(imageAsJimp.getHeight()).toBe(20);
  });

  it("correctly places image when using 'cover' with landscape output", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 200, height: 100 },
      layers: [
        getDefaultLayer({
          placement: "cover",
          origin: { descriptor: "center center" },
          alignment: { descriptor: "center center" },
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
    const filename = "stretch-portrait-center-center";
    await saveArtifact(image, filename);

    expect(await diffPercentage(filename)).toBe(0);
  });

  it("creates image with solid red fill when using 'solid' layer content", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 200, height: 100 },
      layers: [
        getDefaultLayer({
          content: getDefaultSolidLayerContent({
            color: { r: 255, g: 0, b: 0, a: 255 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
            color: { r: 0, g: 255, b: 0, a: 255 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
            color: { r: 0, g: 0, b: 255, a: 255 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
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
            color: { r: 127, g: 127, b: 127, a: 127 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
    const filename = "solid-grey-semi-transparent";
    await saveArtifact(image, filename);

    expect(await diffPercentage(filename)).toBe(0);
  });

  it("creates image with red fill of certain size when using 'solid' layer content", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 200, height: 100 },
      layers: [
        getDefaultLayer({
          content: getDefaultSolidLayerContent({
            color: { r: 255, g: 0, b: 0, a: 255 },
            size: { width: 100, height: 20 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
    const filename = "solid-red-partial-top-left";
    await saveArtifact(image, filename);

    expect(await diffPercentage(filename)).toBe(0);
  });

  it("creates image with red fill of certain size and origin/alignment when using 'solid' layer content", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 200, height: 100 },
      layers: [
        getDefaultLayer({
          origin: { descriptor: "center center" },
          alignment: { descriptor: "center center" },
          content: getDefaultSolidLayerContent({
            color: { r: 255, g: 0, b: 0, a: 255 },
            size: { width: 100, height: 20 },
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
    const filename = "solid-red-partial-center";
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
            color: { r: 255, g: 0, b: 0, a: 100 },
            size: { width: 50, height: 25 },
          }),
        }),
        getDefaultLayer({
          placement: "cover",
          origin: { descriptor: "center center" },
          alignment: { descriptor: "center center" },
          content: getDefaultLayerContent({
            type: "image",
            location: path.resolve("./test/images/400x400.jpeg"),
          }),
        }),
      ],
    });

    const image = await processWorkflow(workflow, Jimp);
    const filename = "image-and-solid";
    await saveArtifact(image, filename);

    expect(await diffPercentage(filename)).toBe(0);
  });
});

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
