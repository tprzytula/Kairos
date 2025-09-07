import { GroceryItemUnit } from '@kairos-lambdas-libs/dynamodb';

export interface IRequestBody {
    id: string;
    quantity?: string;
    name?: string;
    unit?: GroceryItemUnit;
    shopId?: string;
    imagePath?: string;
} 