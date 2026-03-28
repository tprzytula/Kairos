export type ItemVisibility = "private";

export interface IPrivateItemFields {
  visibility?: ItemVisibility;
  ownerId?: string;
}
