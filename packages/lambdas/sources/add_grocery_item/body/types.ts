import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

export interface IRequestBody {
    name: string;
    quantity: number;
    unit: string;
    shopId: string;
    imagePath?: string;
    category?: GroceryItemCategory;
}
