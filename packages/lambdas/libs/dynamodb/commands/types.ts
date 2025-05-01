import { IGroceryItemDefault } from "../types/groceryList/types";

import { DynamoDBTable } from "../enums";
import { IGroceryItem } from "../types/groceryList/types";
import { INoiseTracking } from "../types/noiseTracking/types";

export type TableResponseMap = {
    [DynamoDBTable.GROCERY_LIST]: IGroceryItem;
    [DynamoDBTable.GROCERY_ITEMS_DEFAULTS]: IGroceryItemDefault;
    [DynamoDBTable.NOISE_TRACKING]: INoiseTracking;
};
