import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

export interface IRequestBody {
    name: string;
    quantity: number;
    unit: string;
    imagePath: string;
    category?: GroceryItemCategory;
}
