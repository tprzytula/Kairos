export interface IStep {
    id: string;
    name: string;
    isDone: boolean;
}

export interface IRequestBody {
    id: string;
    name?: string;
    description?: string;
    dueDate?: number;
    isDone?: boolean;
    steps?: IStep[];
    isPrivate?: boolean;
}