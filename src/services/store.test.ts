import type { AnyAction } from '@reduxjs/toolkit';
import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const actualInitialState = rootReducer(undefined, {
      type: '@@INIT'
    } as AnyAction);

    const stateAfterUnknownAction = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as AnyAction);

    expect(stateAfterUnknownAction).toEqual(actualInitialState);
  });
});
