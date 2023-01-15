import {
  isValid,
  validate,
  Workflow,
  workflowSchema,
} from "../src/models/Workflow";

describe("Workflow schema", () => {
  describe("> isValid", () => {
    it("returns false when validating an empty object", async () => {
      const workflow = {};

      const result = await isValid(workflow);
      expect(result).toBe(false);
    });

    it("returns false when 'size' has the wrong type", async () => {
      const workflow = { size: "hello" };

      const result = await isValid(workflow);
      expect(result).toBe(false);
    });

    it("returns true when validating an valid object", async () => {
      const workflow: Workflow = {
        size: { width: 100, height: 200 },
      };

      const result = await isValid(workflow);
      expect(result).toBe(true);
    });
  });

  describe("> validate", () => {
    it("throws when validating null", async () => {
      const workflow = null;

      try {
        await validate(workflow);
        // Fallback to make sure the test fails
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.errors).toHaveLength(1);
      }
    });

    it("throws when validating an empty object", async () => {
      const workflow = {};

      try {
        await validate(workflow);
        // Fallback to make sure the test fails
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.errors).toHaveLength(1);
        expect(e.errors[0]).toContain("size is a required field");
      }
    });

    it("throws when 'size' has the wrong type", async () => {
      const workflow = { size: "hello" };

      try {
        await validate(workflow);
        // Fallback to make sure the test fails
        expect(true).toBe(false);
      } catch (e: any) {
        expect(e.errors).toHaveLength(1);
        expect(e.errors[0]).toContain(
          'size must be a `object` type, but the final value was: `"hello"`.'
        );
      }
    });

    it("does not throw when object is valid", async () => {
      const workflow: Workflow = {
        size: { width: 100, height: 200 },
      };

      try {
        await validate(workflow);
      } catch (e: any) {
        expect(e).toBeFalsy();
      }
    });
  });
});
