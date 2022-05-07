export interface Position {
  x: number;
  y: number;
}

export const getDefaultPosition = (
  properties?: Partial<Position>
): Position => ({
  x: properties?.x ?? 0,
  y: properties?.y ?? 0,
});
