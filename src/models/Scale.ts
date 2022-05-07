export interface Scale {
  x: number;
  y: number;
}

export const getDefaultScale = (properties?: Partial<Scale>): Scale => ({
  x: properties?.x ?? 1,
  y: properties?.y ?? 1,
});
