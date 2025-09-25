import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const actualInitialState = rootReducer(undefined, { type: '@@INIT' });

    const stateAfterUnknownAction = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(stateAfterUnknownAction).toEqual(actualInitialState);
  });
});
