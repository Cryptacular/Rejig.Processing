export interface Origin {
  descriptor:
    | "center"
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
