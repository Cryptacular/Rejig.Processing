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
  start: Point;
  end?: Point;
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
    return {
      m: 0,
      b: p1.y,
      direction: p2.x > p1.x ? "right" : "left",
      start: p1,
      end: p2,
    };
  }

  if (isVertical) {
    return {
      m: Infinity,
      b: 0,
      x: p1.x,
      direction: p2.y > p1.y ? "up" : "down",
      start: p1,
      end: p2,
    };
  }

  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const offset = p1.y - slope * p1.x;

  const direction: LineEquation["direction"] = `${
    p2.y > p1.y ? "up" : "down"
  }-${p2.x > p1.x ? "right" : "left"}`;

  return { m: slope, b: offset, direction, start: p1, end: p2 };
};

export const equationOfPerpendicularLine = (
  line: LineEquation | HorizontalLineEquation | VerticalLineEquation,
  point: Point
): LineEquation | HorizontalLineEquation | VerticalLineEquation => {
  const isHorizontal = line.direction === "left" || line.direction === "right";
  const isVertical = line.direction === "up" || line.direction === "down";

  if (isHorizontal) {
    return {
      m: Infinity,
      b: 0,
      x: point.x,
      direction: "down",
      start: point,
    } as VerticalLineEquation;
  }

  if (isVertical) {
    return {
      m: 0,
      b: point.y,
      direction: "right",
      start: point,
    } as HorizontalLineEquation;
  }

  const slope = -1 / line.m;
  const offset = point.y - slope * point.x;
  const direction = slope > 0 ? "up-right" : "down-right";

  return { m: slope, b: offset, direction, start: point };
};

export const solveEquation = (equation: LineEquation, x: number): number => {
  return equation.m * x + equation.b;
};

export const intersectionOfTwoLines = (
  line1: LineEquation | HorizontalLineEquation | VerticalLineEquation,
  line2: LineEquation | HorizontalLineEquation | VerticalLineEquation
): Point => {
  const isLine1Vertical =
    line1.direction === "up" || line1.direction === "down";
  const isLine2Vertical =
    line2.direction === "up" || line2.direction === "down";
  const isLine1Horizontal =
    line1.direction === "left" || line1.direction === "right";
  const isLine2Horizontal =
    line2.direction === "left" || line2.direction === "right";

  const areLinesTheSame = line1.m === line2.m && line1.b === line2.b;

  if (
    (isLine1Vertical && isLine2Vertical) ||
    (isLine1Horizontal && isLine2Horizontal) ||
    areLinesTheSame
  ) {
    throw new Error("Lines do not intersect");
  }

  /** Working of below logic
    y₁ = m₁x + b₁
    y₂ = m₂x + b₂
    m₁x + b₁ = m₂x + b₂
    m₁x - m₂x = b₂ - b₁
    (m₁ - m₂)x = b₂ - b₁
    x = (b₂ - b₁) / (m₁ - m₂);
  */
  const x = (line2.b - line1.b) / (line1.m - line2.m);
  const y = solveEquation(isLine1Vertical ? line2 : line1, x);

  return { x, y };
};

export const getRatioOfPointAlongLine = (
  line: LineEquation | HorizontalLineEquation | VerticalLineEquation,
  point: Point
): number => {
  if (!line.end) {
    throw new Error("Line needs to have two points (start and end)");
  }

  const isVertical = line.direction === "up" || line.direction === "down";

  if (isVertical) {
    return clamp((point.y - line.start.y) / (line.end.y - line.start.y), 0, 1);
  }

  return clamp((point.x - line.start.x) / (line.end.x - line.start.x), 0, 1);
};

/**
 *
 * @param num Number to clamp
 * @param low Lowest allowed number. If 'num' is lower, this will be returned instead.
 * @param high Highest allowed number. If 'num' is higher, this will be returned instead.
 */
export const clamp = (num: number, low: number, high: number): number => {
  return Math.max(low, Math.min(high, num));
};
