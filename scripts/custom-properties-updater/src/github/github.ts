export type Github = {
  getRepositories(organisation: string): Promise<string[]>;
  getCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
  ): Promise<string>;
  setCustomProperty(
    organisation: string,
    repository: string,
    customProperty: string,
    oldValue: string,
    newValue: string,
  ): Promise<void>;
};
