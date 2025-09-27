import reducer, {
  ConstructorState,
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from './constructor';
import { TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

const mockedUuid = uuidv4 as jest.MockedFunction<typeof uuidv4>;

const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'test-id',
  name: 'Ингредиент',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 50,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...overrides
});

describe('constructor slice', () => {
  beforeEach(() => {
    mockedUuid.mockReset();
  });

  it('должен добавлять булку в конструктор', () => {
    mockedUuid.mockReturnValue('bun-uuid');
    const bun = createIngredient({
      _id: 'bun-1',
      name: 'Булка',
      type: 'bun'
    });

    const state = reducer(undefined, addIngredient({ ingredient: bun }));

    expect(state.bun).toEqual({
      ...bun,
      id: 'bun-uuid'
    });
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавлять начинку в список ингредиентов', () => {
    mockedUuid.mockReturnValue('filling-uuid');
    const filling = createIngredient({
      _id: 'main-1',
      name: 'Начинка',
      type: 'main'
    });

    const state = reducer(undefined, addIngredient({ ingredient: filling }));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...filling,
      id: 'filling-uuid'
    });
  });

  it('должен удалять ингредиент по локальному id', () => {
    const startState: ConstructorState = {
      bun: null,
      ingredients: [
        {
          ...createIngredient({ _id: 'main-1', type: 'main', name: 'Первый' }),
          id: 'id-1'
        },
        {
          ...createIngredient({ _id: 'main-2', type: 'main', name: 'Второй' }),
          id: 'id-2'
        }
      ]
    };

    const state = reducer(startState, removeIngredient({ id: 'id-1' }));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id-2');
  });

  it('должен менять порядок ингредиентов', () => {
    const startState: ConstructorState = {
      bun: null,
      ingredients: [
        {
          ...createIngredient({ _id: 'main-1', type: 'main', name: 'Первый' }),
          id: 'id-1'
        },
        {
          ...createIngredient({ _id: 'main-2', type: 'main', name: 'Второй' }),
          id: 'id-2'
        },
        {
          ...createIngredient({ _id: 'main-3', type: 'main', name: 'Третий' }),
          id: 'id-3'
        }
      ]
    };

    const state = reducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'id-2',
      'id-3',
      'id-1'
    ]);
  });

  it('должен полностью очищать конструктор', () => {
    const startState: ConstructorState = {
      bun: {
        ...createIngredient({ _id: 'bun-1', type: 'bun', name: 'Булка' }),
        id: 'bun-id'
      },
      ingredients: [
        {
          ...createIngredient({ _id: 'main-1', type: 'main', name: 'Начинка' }),
          id: 'main-id'
        }
      ]
    };

    const state = reducer(startState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
