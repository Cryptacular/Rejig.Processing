import Jimp from "jimp";
import path from "path";
import { processWorkflow } from "../src/processor";
import { getDefaultWorkflow } from "../src/models/EditWorkflow";
import { getDefaultLayer } from "../src/models/Layer";
import { getDefaultLayerContent } from "../src/models/LayerContent";

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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "cover-landscape-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "cover-portrait-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "fit-landscape-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "fit-portrait-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "stretch-landscape-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
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
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const imageAsJimp = await Jimp.read(buffer);
    const filename = "stretch-portrait-center-center.png";
    await imageAsJimp.writeAsync(path.resolve(`./test/artifacts/${filename}`));

    const expected = await Jimp.read(
      path.resolve(`./test/expected/${filename}`)
    );
    const actual = await Jimp.read(
      path.resolve(`./test/artifacts/${filename}`)
    );
    const diff = Jimp.diff(expected, actual);

    expect(diff.percent).toBe(0);
  });
});
