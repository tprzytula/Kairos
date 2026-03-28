import { IPrivateItemFields } from "../visibility";

export interface INoiseTracking extends IPrivateItemFields {
    id: string
    timestamp: number
    projectId: string
}
