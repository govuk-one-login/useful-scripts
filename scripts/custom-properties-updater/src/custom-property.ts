export enum CustomProperty {
  Pod = "pod",
  TeamResponsible = "team-responsible",
  ProductionAssets = "production-assets",
}

export const customProperties: CustomProperty[] = Object.values(CustomProperty);

export const isCustomProperty = (
  property: unknown,
): property is CustomProperty =>
  typeof property === "string" &&
  customProperties.includes(property as CustomProperty);
