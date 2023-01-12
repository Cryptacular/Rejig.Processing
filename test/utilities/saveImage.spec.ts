import path from "path";
import { Workflow, getDefaultWorkflow } from "../../src/models/Workflow";
import { processWorkflow } from "../../src/processor";
import { saveImage } from "../../src/utilities/saveImage";
import { diffPercentage } from "./diffPercentage";

describe("saveImage", () => {
  (["png", "jpg", "jpeg", "tiff", "bmp"] as Workflow["format"][]).forEach(
    (format) => {
      it(`Writes image correctly when given '${format}' format`, async () => {
        const workflow = getDefaultWorkflow({
          size: { width: 20, height: 30 },
          format,
          layers: [
            {
              content: {
                type: "gradient",
                color: { from: { r: 255, g: 122, b: 122, a: 1 } },
              },
            },
          ],
        });

        const image = await processWorkflow(workflow);
        await saveImage(
          image,
          path.resolve(`./test/artifacts/format.${format}`)
        );

        expect(await diffPercentage("format", format)).toBe(0);
      });
    }
  );
});
