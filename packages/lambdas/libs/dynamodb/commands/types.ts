import { IGroceryItemDefault } from "../types/groceryList";

import { DynamoDBTable } from "../enums";
import { IGroceryItem } from "../types/groceryList";
import { INoiseTracking } from "../types/noiseTracking";
import { ITodoItem } from "../types/todoList";

export type TableResponseMap = {
    [DynamoDBTable.GROCERY_LIST]: IGroceryItem;
    [DynamoDBTable.GROCERY_ITEMS_DEFAULTS]: IGroceryItemDefault;
    [DynamoDBTable.NOISE_TRACKING]: INoiseTracking;
    [DynamoDBTable.TODO_LIST]: ITodoItem;
};
