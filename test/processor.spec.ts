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

  it("correctly places image when using 'cover'", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 400, height: 200 },
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
    await imageAsJimp.writeAsync(
      path.resolve("./test/artifacts/cover-center-center.png")
    );
  });

  it("correctly places image when using 'fit'", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 400, height: 200 },
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
    await imageAsJimp.writeAsync(
      path.resolve("./test/artifacts/fit-center-center.png")
    );
  });

  it("correctly places image when using 'stretch'", async () => {
    const workflow = getDefaultWorkflow({
      size: { width: 400, height: 200 },
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
    await imageAsJimp.writeAsync(
      path.resolve("./test/artifacts/stretch-center-center.png")
    );
  });
});
