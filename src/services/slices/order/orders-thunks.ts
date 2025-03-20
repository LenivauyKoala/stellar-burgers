import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse,
  TNewOrderResponse,
  TOrderResponse
} from '@api';
import { sliceNames } from '../slices-name';

export const getUserOrders = createAsyncThunk<TFeedsResponse, void>(
  `${sliceNames.ORDER}/getUserOrders`,
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  { data: string[] }
>(`${sliceNames.CREATE}/createOrder`, async ({ data }, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getOrderByNumber = createAsyncThunk<TOrderResponse, number>(
  `${sliceNames.CREATE}/getOrderByNumber`,
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(orderNumber);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
