import { equationOfLineFromPoints } from "../../src/utilities/gradientCalculator";

describe("gradientCalculator", () => {
  describe("> equationOfLineFromPoints", () => {
    it("should throw an error if any coordinates are not fully defined", () => {
      expect(() => equationOfLineFromPoints({}, {})).toThrow();

      expect(() => equationOfLineFromPoints({ x: 1, y: 1 }, {})).toThrow();
      expect(() =>
        equationOfLineFromPoints({ x: 1, y: 1 }, { x: 1 })
      ).toThrow();
      expect(() =>
        equationOfLineFromPoints({ x: 1, y: 1 }, { y: 1 })
      ).toThrow();

      expect(() => equationOfLineFromPoints({}, { x: 1, y: 1 })).toThrow();
      expect(() =>
        equationOfLineFromPoints({ x: 1 }, { x: 1, y: 1 })
      ).toThrow();
      expect(() =>
        equationOfLineFromPoints({ y: 1 }, { x: 1, y: 1 })
      ).toThrow();

      expect(() =>
        equationOfLineFromPoints({ x: 1, y: 1 }, { x: 1, y: 1 })
      ).not.toThrow();
      expect(() =>
        equationOfLineFromPoints({ x: 0, y: 0 }, { x: 0, y: 0 })
      ).not.toThrow();
    });

    it("should return a slope of 0 and correct offset for a horizontal line", () => {
      const p1 = { x: 0, y: 1 };
      const p2 = { x: 1, y: 1 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation).toEqual({ m: 0, b: 1 });
    });

    it("should return a slope of Inf and 0 offset for a vertical line", () => {
      const p1 = { x: 0, y: 1 };
      const p2 = { x: 0, y: 2 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation).toEqual({ m: Infinity, b: 0 });
    });

    it("should return correct slope and offset for a line with a positive slope and offset above zero", () => {
      const p1 = { x: 10, y: 100 };
      const p2 = { x: 120, y: 180 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBeCloseTo(0.727272727273);
      expect(equation.b).toBeCloseTo(92.727272727273);
    });

    it("should return correct slope and offset for a line with a positive slope and offset below zero", () => {
      const p1 = { x: 80, y: 100 };
      const p2 = { x: 120, y: 180 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBe(2);
      expect(equation.b).toBe(-60);
    });

    it("should return correct slope and offset for a line with a negative slope and offset above zero", () => {
      const p1 = { x: 80, y: 180 };
      const p2 = { x: 120, y: 100 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBe(-2);
      expect(equation.b).toBe(340);
    });

    it("should return correct slope and offset for a line with a negative slope and offset below zero", () => {
      const p1 = { x: 10, y: -80 };
      const p2 = { x: 120, y: -200 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBeCloseTo(-1.09091);
      expect(equation.b).toBeCloseTo(-69.0909);
    });
  });
});
