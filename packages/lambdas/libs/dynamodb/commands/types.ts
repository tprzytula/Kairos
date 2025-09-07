import { IGroceryItemDefault } from "../types/groceryList";

import { DynamoDBTable } from "../enums";
import { IGroceryItem } from "../types/groceryList";
import { INoiseTracking } from "../types/noiseTracking";
import { ITodoItem } from "../types/todoList";
import { IProject, IProjectMember } from "../types/projects";
import { IPushSubscription } from "../types/pushSubscriptions";
import { IShop } from "../types/shops";

export type TableResponseMap = {
    [DynamoDBTable.GROCERY_LIST]: IGroceryItem;
    [DynamoDBTable.GROCERY_ITEMS_DEFAULTS]: IGroceryItemDefault;
    [DynamoDBTable.NOISE_TRACKING]: INoiseTracking;
    [DynamoDBTable.TODO_LIST]: ITodoItem;
    [DynamoDBTable.MIGRATIONS]: { [key: string]: string | number | boolean | undefined; };
    [DynamoDBTable.PROJECTS]: IProject;
    [DynamoDBTable.PROJECT_MEMBERS]: IProjectMember;
    [DynamoDBTable.PUSH_SUBSCRIPTIONS]: IPushSubscription;
    [DynamoDBTable.SHOPS]: IShop;
};
