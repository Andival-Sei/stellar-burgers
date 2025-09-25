import { RootState } from '../store';

// Селекторы ингредиентов
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((i) => i._id === id) || null;
