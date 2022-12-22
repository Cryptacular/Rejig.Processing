import { Position } from "../models/Position";

/**
 * Represents the equation for a line in the format 'y = mx + b'
 */
interface LineEquation {
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
 * Represents the a vertical line where 'x' is the horizontal position of the line
 */
interface VerticalLineEquation extends LineEquation {
  direction: "up" | "down";
  x: number;
  }

interface Point {
  x: number;
  y: number;
}

export const equationOfLineFromPoints = (
  p1: Point,
  p2: Point
): LineEquation | VerticalLineEquation => {
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

// Calculate slope of line

// Calculate perpendicular slope

// Find equation of line of a given slope through a point

// Find intersection between two lines

// Calculate position along gradient (between 0 and 1)
