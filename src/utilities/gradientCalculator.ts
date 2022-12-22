import { Position } from "../models/Position";

/**
 * Represents the equation for a line in the format 'y = mx + b'
 */
interface LineEquation {
  m: number;
  b: number;
}

export const equationOfLineFromPoints = (
  p1: Position,
  p2: Position
): LineEquation => {
  if (
    p1.x === undefined ||
    p1.y === undefined ||
    p2.x === undefined ||
    p2.y === undefined
  ) {
    throw new Error(
      `Could not calculate equation from points: '${JSON.stringify(
        p1
      )}' and '${JSON.stringify(p2)}'`
    );
  }

  const isHorizontal = p1.y === p2.y;
  const isVertical = p1.x === p2.x;

  if (isHorizontal) {
    return { m: 0, b: p1.y };
  }

  if (isVertical) {
    return { m: Infinity, b: 0 };
  }

  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const offset = p1.y - slope * p1.x;

  return { m: slope, b: offset };
};

// Calculate slope of line

// Calculate perpendicular slope

// Find equation of line of a given slope through a point

// Find intersection between two lines

// Calculate position along gradient (between 0 and 1)
