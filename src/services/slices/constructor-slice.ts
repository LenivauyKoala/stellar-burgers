import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { sliceNames } from './slices-name';
import { RootState } from '../store';
import { v4 as uuidv4 } from 'uuid';

interface TConstructorState {
  bun: TConstructorIngredient | null;
  constructorIngredients: TConstructorIngredient[];
}

const initialState: TConstructorState = {
  bun: null,
  constructorIngredients: []
};

export const constructorSlice = createSlice({
  name: sliceNames.CONSTRUCTOR,
  initialState,
  reducers: {
    /**
     * Добавляет ингредиент в конструктор.
     * Если ингредиент является булкой, заменяет текущую булку.
     * Иначе добавляет ингредиент в список.
     */
    addIngredientToConstructor: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.constructorIngredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },

    /**
     * Удаляет ингредиент из конструктора.
     */
    removeIngredientFromConstructor: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.id !== action.payload.id
      );
    },

    /**
     * Перемещает ингредиент в списке конструктора.
     */
    moveIngredientUpAndDown: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.constructorIngredients];
      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);

      state.constructorIngredients = ingredients;
    },
    /**
     * Очищает конструктор.
     */
    clearConstructor: (state) => {
      state.bun = null;
      state.constructorIngredients = [];
    }
  }
});

export const {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  clearConstructor,
  moveIngredientUpAndDown
} = constructorSlice.actions;

/**
 * Селекторы.
 */
export const selectConstructorBun = (state: RootState) =>
  (state[sliceNames.CONSTRUCTOR] as TConstructorState).bun;

export const selectConstructorIngredients = (state: RootState) =>
  (state[sliceNames.CONSTRUCTOR] as TConstructorState).constructorIngredients;
