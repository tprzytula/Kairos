export enum Route {
    Home = '/',
    NonExisting = '/non-existing',
    AddGroceryItem = '/groceries/add',
    EditGroceryItem = '/groceries/edit/:id',
    GroceryList = '/groceries',
    NoiseTracking = '/noise-tracking',
    ToDoList = '/todo',
    AddToDoItem = '/todo/add',
    EditToDoItem = '/todo/edit/:id',
    AuthCallback = '/auth/callback',
    SilentCallback = '/silent-callback',
}
