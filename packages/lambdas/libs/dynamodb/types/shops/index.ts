import { IPrivateItemFields } from "../visibility";

export interface IShop extends IPrivateItemFields {
    id: string
    projectId: string
    name: string
    icon?: string
    createdAt: string
    updatedAt: string
}
