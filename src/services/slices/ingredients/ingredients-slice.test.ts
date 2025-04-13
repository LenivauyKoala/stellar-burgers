import { ingredientsSlice, initialState } from './ingredients-slice';

const mockIngredientsData = [
  { id: '0', name: 'Булка 1', type: 'bun' },
  { id: '1', name: 'Ингредиент 1', type: 'main' },
];

describe('Проверка работы ingredients', () => {
  it('должен установить isLoading в true при запросе', () => {
    const action = { type: 'ingredients/fetchIngredients/pending' };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state.isLoading).toBeTruthy();
    expect(state.error).toBeNull();
  });
  
  it('должен корректно обрабатывать успешную загрузку', () => {
    const action = {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockIngredientsData
    };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state.isLoading).toBeFalsy();
    expect(state.ingredients).toEqual(mockIngredientsData);
    expect(state.error).toBeNull();
  });

  it('должен корректно обрабатывать ошибку при загрузке', () => {
    const testError = 'Ошибка загрузки данных с сервера';
    const action = {
      type: 'ingredients/fetchIngredients/rejected',
      error: { message: testError }
    };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state.isLoading).toBeFalsy();
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe(testError);
  });

  it('должен сохранять исходное состояние при неизвестном действии', () => {
    const action = { type: 'unknown/action' };
    const state = ingredientsSlice.reducer(initialState, action);

    expect(state).toEqual(initialState);
  });
});
