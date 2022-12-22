import { Position } from "../models/Position";

/**
 * Represents the equation for a line in the format 'y = mx + b'
 */
export interface LineEquation {
  m: number;
  b: number;
  direction:
    | "up"
    | "down"
    | "left"
    | "right"
    | "up-right"
    | "up-left"
    | "down-right"
    | "down-left";
}

/**
 * Represents a horizontal line
 */
export interface HorizontalLineEquation extends LineEquation {
  m: 0;
  direction: "left" | "right";
}

/**
 * Represents a vertical line where 'x' is the horizontal position of the line
 */
export interface VerticalLineEquation extends LineEquation {
  b: 0;
  x: number;
  direction: "up" | "down";
}

export interface Point {
  x: number;
  y: number;
}

export const equationOfLineFromPoints = (
  p1: Point,
  p2: Point
): LineEquation | HorizontalLineEquation | VerticalLineEquation => {
  const isHorizontal = p1.y === p2.y;
  const isVertical = p1.x === p2.x;

  if (isHorizontal) {
    return { m: 0, b: p1.y, direction: p2.x > p1.x ? "right" : "left" };
  }

  if (isVertical) {
    return {
      m: Infinity,
      b: 0,
      x: p1.x,
      direction: p2.y > p1.y ? "up" : "down",
    };
  }

  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const offset = p1.y - slope * p1.x;

  const direction: LineEquation["direction"] = `${
    p2.y > p1.y ? "up" : "down"
  }-${p2.x > p1.x ? "right" : "left"}`;

  return { m: slope, b: offset, direction };
};

export const equationOfPerpendicularLine = (
  line: LineEquation | HorizontalLineEquation | VerticalLineEquation,
  point: Point
): LineEquation | HorizontalLineEquation | VerticalLineEquation => {
  const isHorizontal = line.direction === "left" || line.direction === "right";
  const isVertical = line.direction === "up" || line.direction === "down";

  if (isHorizontal) {
    if (point.y !== line.b) throw new Error("Point is not along line");

    return {
      m: Infinity,
      b: 0,
      x: point.x,
      direction: "down",
    } as VerticalLineEquation;
  }

  if (isVertical) {
    const verticalLine = line as VerticalLineEquation;
    if (point.x !== verticalLine.x) throw new Error("Point is not along line");

    return {
      m: 0,
      b: point.y,
      direction: "right",
    } as HorizontalLineEquation;
  }

  if (Math.abs(solveEquation(line, point.x) - point.y) > 0.01) {
    throw new Error("Point is not along line");
  }

  const slope = -1 / line.m;
  const offset = point.y - slope * point.x;
  const direction = slope > 0 ? "up-right" : "down-right";

  return { m: slope, b: offset, direction };
};

export const solveEquation = (equation: LineEquation, x: number): number => {
  return equation.m * x + equation.b;
};

// Find equation of line of a given slope through a point

// Find intersection between two lines

// Calculate position along gradient (between 0 and 1)
