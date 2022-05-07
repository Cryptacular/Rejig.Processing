import Jimp from "jimp";
import { processWorkflow } from "./processor";
import { getDefaultWorkflow } from "./models/EditWorkflow";

describe("Processor", () => {
  it("returns a BAS64 string of type PNG when given a default workflow", async () => {
    const workflow = getDefaultWorkflow();

    const image = await processWorkflow(workflow, Jimp);

    expect(image).not.toBeNull();
    expect(image).toContain("data:image/png;base64");
  });
});
