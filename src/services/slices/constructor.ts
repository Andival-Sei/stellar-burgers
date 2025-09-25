import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Этот слайс хранит состояние конструктора: выбранная булка и список начинок
export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const constructorInitialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState: constructorInitialState,
  reducers: {
    // Добавляю ингредиент: генерирую уникальный id в prepare (вне редьюсера)
    addIngredient: {
      reducer(
        state,
        action: PayloadAction<{ ingredient: TConstructorIngredient }>
      ) {
        const { ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare(payload: { ingredient: TIngredient }) {
        const { ingredient } = payload;
        return {
          payload: {
            ingredient: { ...ingredient, id: uuidv4() }
          }
        };
      }
    },
    // Удаляю начинку по локальному id
    removeIngredient(state, action: PayloadAction<{ id: string }>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload.id
      );
    },
    // Переставляю начинку по индексу (drag-n-drop)
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.ingredients];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.ingredients = items;
    },
    // Полная очистка конструктора (после успешного заказа)
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
