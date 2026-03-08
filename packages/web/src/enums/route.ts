export enum Route {
    Home = '/',
    NonExisting = '/non-existing',
    Shops = '/shops',
    AddGroceryItem = '/groceries/:shopId/add',
    EditGroceryItem = '/groceries/:shopId/edit/:id',
    GroceryList = '/groceries/:shopId',
    NoiseTracking = '/noise-tracking',
    Planner = '/planner',
    AddPlannerItem = '/planner/add',
    EditPlannerItem = '/planner/edit/:id',
    AuthCallback = '/auth/callback',
    SilentCallback = '/silent-callback',
}
