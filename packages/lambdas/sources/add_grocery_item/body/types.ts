import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

export interface IRequestBodyItem {
    name: string;
    quantity: number;
    unit: string;
    shopId: string;
    imagePath?: string;
    category?: GroceryItemCategory;
}

export interface IRequestBody {
    items: IRequestBodyItem[];
    isPrivate?: boolean;
}
