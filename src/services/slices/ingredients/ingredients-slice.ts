import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from '../../store';
import { getIngredients } from './ingredients-thunks';
import { sliceNames } from '../slices-name';

interface TIngredientState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TIngredientState = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const ingredientsSlice = createSlice({
  name: sliceNames.INGREDIENTS,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось получить ингредиенты';
      });
  }
});

export const selectIngredients = (state: RootState) =>
  (state[sliceNames.INGREDIENTS] as TIngredientState).ingredients;

export const selectIsLoading = (state: RootState) =>
  (state[sliceNames.INGREDIENTS] as TIngredientState).isLoading;

export { getIngredients };
