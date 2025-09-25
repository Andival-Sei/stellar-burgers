import reducer, {
  IngredientsState,
  fetchIngredients,
  ingredientsInitialState
} from './ingredients';
import { TIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Краторный соус',
  type: 'sauce',
  proteins: 5,
  fat: 10,
  carbohydrates: 15,
  calories: 20,
  price: 25,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides
});

const cloneState = (state: IngredientsState): IngredientsState => ({
  ...state,
  items: [...state.items]
});

describe('ingredients slice', () => {
  it('должен устанавливать флаг загрузки в true при fetchIngredients.pending', () => {
    const state = reducer(
      cloneState(ingredientsInitialState),
      fetchIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  it('должен сохранять ингредиенты и сбрасывать флаг загрузки при fetchIngredients.fulfilled', () => {
    const items: TIngredient[] = [
      createIngredient({ _id: '1', name: 'Булка', type: 'bun' }),
      createIngredient({ _id: '2', name: 'Начинка', type: 'main' })
    ];

    const state = reducer(
      {
        ...cloneState(ingredientsInitialState),
        isLoading: true
      },
      fetchIngredients.fulfilled(items, '', undefined)
    );

    expect(state).toEqual({
      items,
      isLoading: false,
      error: null
    });
  });

  it('должен сохранять ошибку и сбрасывать флаг загрузки при fetchIngredients.rejected', () => {
    const error = new Error('Ошибка загрузки');

    const state = reducer(
      {
        ...cloneState(ingredientsInitialState),
        isLoading: true
      },
      fetchIngredients.rejected(error, '', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
