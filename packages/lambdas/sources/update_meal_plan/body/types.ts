export interface IRequestBody {
    id: string;
    date?: string;
    recipeName?: string;
    recipeId?: string | null;
    mealType?: string | null;
    imagePath?: string | null;
}
