import { IGroceryItemDefault } from "../types/groceryList";

import { DynamoDBTable } from "../enums";
import { IGroceryItem } from "../types/groceryList";
import { INoiseTracking } from "../types/noiseTracking";
import { ITodoItem } from "../types/todoList";
import { IProject, IProjectMember } from "../types/projects";
import { IPushSubscription } from "../types/pushSubscriptions";
import { IShop } from "../types/shops";
import { IRecipe } from "../types/recipes";
import { IAdventure } from "../types/adventures";
import { IBirthdayItem } from "../types/birthdays";
import { IMealPlan } from "../types/mealPlans";
import { IOfficeAttendance } from "../types/officeAttendance";

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
    [DynamoDBTable.RECIPES]: IRecipe;
    [DynamoDBTable.ADVENTURES]: IAdventure;
    [DynamoDBTable.BIRTHDAYS]: IBirthdayItem;
    [DynamoDBTable.MEAL_PLANS]: IMealPlan;
    [DynamoDBTable.OFFICE_ATTENDANCE]: IOfficeAttendance;
};
