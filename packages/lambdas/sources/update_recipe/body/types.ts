import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";

export interface IRecipeIngredientBody {
    name: string;
    quantity: number;
    unit: GroceryItemUnit;
}

export interface IRequestBody {
    id: string;
    name?: string;
    ingredients?: IRecipeIngredientBody[];
    imagePath?: string;
}
