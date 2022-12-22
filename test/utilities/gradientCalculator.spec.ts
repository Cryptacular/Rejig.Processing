import {
  equationOfLineFromPoints,
  equationOfPerpendicularLine,
  HorizontalLineEquation,
  LineEquation,
  Point,
  VerticalLineEquation,
} from "../../src/utilities/gradientCalculator";

describe("gradientCalculator", () => {
  describe("> equationOfLineFromPoints", () => {
    it("should return a slope of 0 and correct offset for a horizontal line", () => {
      const p1 = { x: 0, y: 1 };
      const p2 = { x: 1, y: 1 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation).toEqual({ m: 0, b: 1, direction: "right" });
    });

    it("should return a slope of Inf and 0 offset for a vertical line", () => {
      const p1 = { x: 3, y: 1 };
      const p2 = { x: 3, y: 2 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation).toEqual({ m: Infinity, b: 0, x: 3, direction: "up" });
    });

    it("should return correct slope and offset for a line with a positive slope and offset above zero", () => {
      const p1 = { x: 10, y: 100 };
      const p2 = { x: 120, y: 180 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBeCloseTo(0.727272727273);
      expect(equation.b).toBeCloseTo(92.727272727273);
      expect(equation.direction).toBe("up-right");
    });

    it("should return correct slope and offset for a line with a positive slope and offset below zero", () => {
      const p1 = { x: 80, y: 100 };
      const p2 = { x: 120, y: 180 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBe(2);
      expect(equation.b).toBe(-60);
      expect(equation.direction).toBe("up-right");
    });

    it("should return correct slope and offset for a line with a negative slope and offset above zero", () => {
      const p1 = { x: 80, y: 180 };
      const p2 = { x: 120, y: 100 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBe(-2);
      expect(equation.b).toBe(340);
      expect(equation.direction).toBe("down-right");
    });

    it("should return correct slope and offset for a line with a negative slope and offset below zero", () => {
      const p1 = { x: 10, y: -80 };
      const p2 = { x: 120, y: -200 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBeCloseTo(-1.09091);
      expect(equation.b).toBeCloseTo(-69.0909);
      expect(equation.direction).toBe("down-right");
    });

    it("should return correct slope and offset for a line with points specified from right-to-left", () => {
      const p1 = { x: 120, y: 180 };
      const p2 = { x: 10, y: 100 };

      const equation = equationOfLineFromPoints(p1, p2);

      expect(equation.m).toBeCloseTo(0.727272727273);
      expect(equation.b).toBeCloseTo(92.727272727273);
      expect(equation.direction).toBe("down-left");
    });
  });

  describe("> equationOfPerpendicularLine", () => {
    it("should return horizontal line through specified point when given a vertical line", () => {
      const line: VerticalLineEquation = {
        m: Infinity,
        b: 0,
        x: 8,
        direction: "down",
      };
      const point: Point = { x: 8, y: 12 };

      const perpendicular = equationOfPerpendicularLine(line, point);

      expect(perpendicular).toEqual({ m: 0, b: 12, direction: "right" });
    });

    it("should return vertical line through specified point when given a horizontal line", () => {
      const line: HorizontalLineEquation = {
        m: 0,
        b: 8,
        direction: "right",
      };
      const point: Point = { x: 4, y: 8 };

      const perpendicular = equationOfPerpendicularLine(line, point);

      expect(perpendicular).toEqual({
        m: Infinity,
        b: 0,
        x: 4,
        direction: "down",
      });
    });

    it("should return perpendicular line through specified point when given a line with positive slope and offset above zero", () => {
      const p1 = { x: 80, y: 100 };
      const p2 = { x: 120, y: 180 };
      const equation = equationOfLineFromPoints(p1, p2);

      const perpendicular = equationOfPerpendicularLine(equation, p1);

      expect(perpendicular).toEqual({
        m: -0.5,
        b: 140,
        direction: "down-right",
      });
    });

    it("should return perpendicular line through specified point when given a line with negative slope and offset above zero", () => {
      const p1 = { x: 80, y: 180 };
      const p2 = { x: 120, y: 100 };
      const equation = equationOfLineFromPoints(p1, p2);

      const perpendicular = equationOfPerpendicularLine(equation, p1);

      expect(perpendicular).toEqual({
        m: 0.5,
        b: 140,
        direction: "up-right",
      });
    });
  });
});
