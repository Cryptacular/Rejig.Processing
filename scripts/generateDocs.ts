import fs from "fs";
import yaml from "js-yaml";
import { validate, Workflow } from "../src/models/Workflow";

const run = async () => {
  const minimalExample: Workflow = {
    size: {
      width: 1920,
      height: 1080,
    },
  };

  const complexExample: any = {
    id: "43c2f6b1-b975-4010-81c2-de7e28192cd1",
    name: "my-custom-workflow",
    authorId: "user123",
    size: {
      width: 1920,
      height: 1080,
    },
    layers: [
      {
        id: "layer-with-solid-color",
        name: "Overlay",
        content: { type: "solid", color: { r: 122, g: 122, b: 255, a: 255 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "bottom right" },
        placement: "cover",
        scale: { x: 100, y: 100 },
        opacity: 15,
      },
      {
        id: "layer-with-image",
        name: "Background image",
        content: { type: "image", location: "https://url/to/an/image.jpg" },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "bottom right" },
        placement: "cover",
        scale: { x: 100, y: 100 },
        opacity: 100,
      },
    ],
    parameters: [
      {
        id: "background",
        name: "Background",
        targetLayer: "layer-with-image",
        targetProperty: "content.location",
      },
    ],
    remixedFrom: "30013602-d2ed-4599-921f-5918611b6236",
    created: new Date(2022, 11, 18, 10, 34, 4),
    modified: new Date(2022, 11, 18, 11, 12, 13),
  };

  try {
    await validate(minimalExample);
    await validate(complexExample);
  } catch (error) {
    throw new Error("Workflow is not valid: " + error);
  }

  const readme = fs.readFileSync("./README.md", "utf-8");

  const updatedReadme = readme
    .replace(
      /<!-- start-minimal-workflow -->(.|\n|\r)+<!-- end-minimal-workflow -->/,
      "<!-- start-minimal-workflow -->\n\nJSON:\n\n```json\n" +
        JSON.stringify(minimalExample, null, 2) +
        "\n```\n\nYAML:\n\n```yaml\n" +
        yaml.dump(minimalExample) +
        "```\n\n<!-- end-minimal-workflow -->"
    )
    .replace(
      /<!-- start-complex-workflow -->(.|\n|\r)+<!-- end-complex-workflow -->/,
      "<!-- start-complex-workflow -->\n\nJSON:\n\n```json\n" +
        JSON.stringify(complexExample, null, 2) +
        "\n```\n\nYAML:\n\n```yaml\n" +
        yaml.dump(complexExample) +
        "```\n\n<!-- end-complex-workflow -->"
    );

  fs.writeFileSync("./README.md", updatedReadme, "utf-8");
};

run();
