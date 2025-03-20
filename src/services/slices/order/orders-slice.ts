import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { sliceNames } from '../slices-name';
import { getUserOrders } from './orders-thunks';

interface TOrderState {
  userOrder: TOrder[];
  isLoading: boolean;
}

const initialState: TOrderState = {
  userOrder: [],
  isLoading: false
};

export const orderSlice = createSlice({
  name: sliceNames.ORDER,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.userOrder = action.payload?.orders || [];
        }
      )
      .addCase(getUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const selectUserOrders = (state: RootState) => {
  const { userOrder } = state[sliceNames.ORDER] as TOrderState;
  return userOrder;
};
