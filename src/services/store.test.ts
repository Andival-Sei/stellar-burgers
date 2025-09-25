import type { AnyAction } from '@reduxjs/toolkit';
import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as AnyAction);

    expect(initialState).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderData: null,
        lastError: null
      },
      feeds: {
        feed: null,
        orders: [],
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      }
    });
  });
});
