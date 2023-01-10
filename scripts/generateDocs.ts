import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import yupToJsonSchema from "@sodaru/yup-to-json-schema";
import {
  getDefaultWorkflow,
  validate,
  Workflow,
  workflowSchema,
} from "../src/models/Workflow";
import { processWorkflow } from "../src/processor";

const run = async () => {
  const schemaDescription = workflowSchema.describe();

  const minimalExample: Workflow = {
    name: "sample-workflow-minimal",
    size: {
      width: 75,
      height: 50,
    },
    layers: [
      { content: { type: "solid", color: { r: 122, g: 0, b: 122, a: 1 } } },
    ],
  };

  const complexExample: Workflow = {
    id: "43c2f6b1-b975-4010-81c2-de7e28192cd1",
    name: "sample-workflow-complex",
    authorId: "user123",
    size: {
      width: 150,
      height: 150,
    },
    layers: [
      {
        id: "layer-with-mask",
        content: { type: "solid", color: { r: 255, g: 255, b: 255, a: 1 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "center center" },
        placement: "cover",
        mask: {
          content: {
            type: "image",
            location:
              "https://images.unsplash.com/photo-1531979089097-fe46b4e4f235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2658&q=80",
          },
          placement: "cover",
          origin: { descriptor: "center center" },
          alignment: { descriptor: "center center" },
        },
        blendingMode: "hardlight",
      },
      {
        id: "layer-with-solid-color-1",
        name: "Overlay",
        content: { type: "solid", color: { r: 122, g: 122, b: 255, a: 1 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "bottom right" },
        placement: "cover",
        scale: { x: 1, y: 1 },
        opacity: 15,
      },
      {
        id: "layer-with-solid-color-2",
        name: "Overlay",
        content: { type: "solid", color: { r: 255, g: 122, b: 122, a: 1 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "top left" },
        placement: "cover",
        scale: { x: 1, y: 1 },
        opacity: 85,
        blendingMode: "overlay",
      },
      {
        id: "layer-with-solid-color-3",
        name: "Overlay",
        content: { type: "solid", color: { r: 255, g: 122, b: 255, a: 1 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "top right" },
        placement: "cover",
        scale: { x: 1, y: 1 },
        opacity: 15,
      },
      {
        id: "layer-with-solid-color-4",
        name: "Overlay",
        content: { type: "solid", color: { r: 122, g: 255, b: 122, a: 1 } },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "bottom left" },
        placement: "cover",
        scale: { x: 1, y: 1 },
        opacity: 15,
      },
      {
        id: "layer-with-image",
        name: "Background image",
        content: {
          type: "image",
          location:
            "https://images.unsplash.com/photo-1541513161836-e2049e89afaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHR3aXN0fGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        },
        position: { x: 0, y: 0 },
        origin: { descriptor: "center center" },
        alignment: { descriptor: "center center" },
        placement: "fit",
        scale: { x: 1, y: 1 },
        opacity: 100,
      },
      {
        id: "layer-with-gradient",
        name: "Linear gradient",
        content: {
          type: "gradient",
          color: {
            from: { r: 255, g: 255, b: 255, a: 1 },
            to: { r: 20, g: 0, b: 0, a: 1 },
          },
          pos: {
            from: { x: 150, y: 150 },
            to: { x: 0, y: 0 },
          },
        },
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

    createImage(minimalExample);
    createImage(complexExample);
  } catch (error) {
    throw new Error("Workflow is not valid: " + error);
  }

  const readme = fs.readFileSync("./README.md", "utf-8");

  const updatedReadme = readme
    .replace(
      /<!-- start-minimal-workflow -->(.|\n|\r)+<!-- end-minimal-workflow -->/,
      "<!-- start-minimal-workflow -->\n\n#### JSON\n\n```json\n" +
        JSON.stringify(minimalExample, null, 2) +
        "\n```\n\n#### YAML\n\n```yaml\n" +
        yaml.dump(minimalExample) +
        "```\n\n<!-- end-minimal-workflow -->"
    )
    .replace(
      /<!-- start-complex-workflow -->(.|\n|\r)+<!-- end-complex-workflow -->/,
      "<!-- start-complex-workflow -->\n\n#### JSON\n\n```json\n" +
        JSON.stringify(complexExample, null, 2) +
        "\n```\n\n#### YAML\n\n```yaml\n" +
        yaml.dump(complexExample) +
        "```\n\n<!-- end-complex-workflow -->"
    )
    .replace(
      /<!-- start-workflow-schema -->(.|\n|\r)+<!-- end-workflow-schema -->/,
      "<!-- start-workflow-schema -->\n\n```json\n" +
        JSON.stringify(schemaDescription, null, 2) +
        "```\n\n<!-- end-workflow-schema -->"
    );

  fs.writeFileSync("./README.md", updatedReadme, "utf-8");

  await generateJsonSchema();
};

async function createImage(workflow: Workflow) {
  const image = await processWorkflow(getDefaultWorkflow(workflow));

  const outputFolder = path.resolve("./images");
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const base64Matches = image.match(/^data:([+/A-Za-z-]+);base64,(.+)$/);

  if (base64Matches) {
    const buffer = Buffer.from(base64Matches[2], "base64");
    fs.writeFileSync(
      path.resolve(outputFolder, workflow.name + ".png"),
      buffer
    );
  }
}

async function generateJsonSchema() {
  const jsonSchema = yupToJsonSchema(workflowSchema);
  fs.writeFileSync(
    path.resolve("json-schema/workflow.json"),
    JSON.stringify(jsonSchema, null, 2),
    "utf-8"
  );
}

run();
