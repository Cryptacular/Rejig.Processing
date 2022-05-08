export interface Origin {
  descriptor:
    | "top left"
    | "top center"
    | "top right"
    | "center left"
    | "center center"
    | "center right"
    | "bottom left"
    | "bottom center"
    | "bottom right";
}

export const getDefaultOrigin = (properties?: Partial<Origin>): Origin => ({
  descriptor: properties?.descriptor ?? "top left",
});
