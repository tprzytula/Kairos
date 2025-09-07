export enum Route {
    Home = '/',
    NonExisting = '/non-existing',
    Shops = '/shops',
    AddGroceryItem = '/groceries/:shopId/add',
    EditGroceryItem = '/groceries/:shopId/edit/:id',
    GroceryList = '/groceries/:shopId',
    NoiseTracking = '/noise-tracking',
    ToDoList = '/todo',
    AddToDoItem = '/todo/add',
    EditToDoItem = '/todo/edit/:id',
    AuthCallback = '/auth/callback',
    SilentCallback = '/silent-callback',
}
