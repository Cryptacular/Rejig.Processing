import { workflowSchema } from "../src/models/Workflow";

describe("Workflow schema", () => {
  it("is not valid when validating an empty object", async () => {
    const workflow = {};

    expect(() =>
      workflowSchema.validateSync(workflow, { strict: true })
    ).toThrow();
  });

  it("is not valid when 'size' has the wrong type", async () => {
    const workflow = { size: "hello" };

    expect(() =>
      workflowSchema.validateSync(workflow, { strict: true })
    ).toThrow();
  });
});
