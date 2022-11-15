import { getDefaultWorkflow } from "../src/models/Workflow";
import {
  getDefaultImageLayerContent,
  ImageLayerContent,
} from "../src/models/ImageLayerContent";
import { getDefaultLayer } from "../src/models/Layer";
import { applyParameters } from "../src/utilities/applyParameters";

jest.mock("uuid");

describe("ApplyParameters", () => {
  it("returns workflow without changes if 'parameters' property is undefined", async () => {
    const workflow = getDefaultWorkflow();
    workflow.parameters = undefined;

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(workflow);
  });

  it("returns workflow without changes if 'parameters' property is an empty array", async () => {
    const workflow = getDefaultWorkflow({ parameters: [] });
    const expected = getDefaultWorkflow({ parameters: [] });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("returns workflow with changes on a layer property that exist (one level deep)", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "opacity",
          value: "0.5",
        },
      ],
      layers: [getDefaultLayer({ id: "layer-1" })],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).not.toEqual(workflow);
    expect(workflowWithAppliedParameters.parameters).toHaveLength(0);
    expect(workflowWithAppliedParameters.layers![0].opacity).toBe(0.5);
  });

  it("returns workflow with changes on a layer property that exist (two levels deep)", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "content.location",
          value: "http://site.com/location-of-image.jpeg",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).not.toEqual(workflow);
    expect(workflowWithAppliedParameters.parameters).toHaveLength(0);
    expect(
      (workflowWithAppliedParameters.layers![0].content as ImageLayerContent)
        .location
    ).toBe("http://site.com/location-of-image.jpeg");
  });

  it("returns workflow without changes if target layer doesn't exist", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "content.location",
          value: "http://site.com/location-of-image.jpeg",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-9999",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const expected = getDefaultWorkflow({
      parameters: [],
      layers: [
        getDefaultLayer({
          id: "layer-9999",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("returns workflow without changes if targetLayer is not defined", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetProperty: "content.location",
          value: "http://site.com/location-of-image.jpeg",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const expected = getDefaultWorkflow({
      parameters: [],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("returns workflow without changes if targetProperty is not defined", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          value: "http://site.com/location-of-image.jpeg",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const expected = getDefaultWorkflow({
      parameters: [],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("returns workflow without changes if value is not defined", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "content.location",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const expected = getDefaultWorkflow({
      parameters: [],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("returns workflow without changes if types don't match but can be converted", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "scale",
          value: `{ "x": 1.5, "y": 8 }`,
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const expected = getDefaultWorkflow({
      parameters: [],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          scale: { x: 1.5, y: 8 },
          content: getDefaultImageLayerContent(),
        }),
      ],
    });

    const workflowWithAppliedParameters = await applyParameters(workflow);

    expect(workflowWithAppliedParameters).toEqual(expected);
  });

  it("does not alter the original object when applying parameters", async () => {
    const workflow = getDefaultWorkflow({
      parameters: [
        {
          id: "abc",
          name: "abc",
          targetLayer: "layer-1",
          targetProperty: "content.location",
          value: "http://site.com/location-of-image.jpeg",
        },
      ],
      layers: [
        getDefaultLayer({
          id: "layer-1",
          content: getDefaultImageLayerContent(),
        }),
      ],
    });
    const workflowBeforeApplyingChanges = JSON.stringify(workflow);

    const workflowWithAppliedParameters = await applyParameters(workflow);
    const workflowAfterApplyingChanges = JSON.stringify(
      workflowWithAppliedParameters
    );

    expect(workflowAfterApplyingChanges).not.toEqual(
      workflowBeforeApplyingChanges
    );
    expect(JSON.stringify(workflow)).toEqual(workflowBeforeApplyingChanges);
  });
});
