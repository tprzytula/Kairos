export interface IRequestBody {
    items: Array<IRequestBodyItem>;
}

export interface IRequestBodyItem {
    id: string;
    isDone: boolean;
}
