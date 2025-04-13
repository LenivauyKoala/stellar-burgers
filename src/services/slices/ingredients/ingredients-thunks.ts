import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { sliceNames } from '../slices-name';

export const getIngredients = createAsyncThunk(
  `${sliceNames.INGREDIENTS}/fetchIngredients`,
  async () => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      throw new Error('Не удалось получить ингредиенты');
    }
  }
);
