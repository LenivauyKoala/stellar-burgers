import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TNewOrderResponse, TOrderResponse } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { sliceNames } from '../slices-name';
import { createOrder, getOrderByNumber } from '../order/orders-thunks';

interface TCreateState {
  order: TOrder | null;
  orderCall: boolean;
  orderByNumber: TOrder[] | null;
}

const initialState: TCreateState = {
  order: null,
  orderCall: false,
  orderByNumber: null
};

export const newOrderSlice = createSlice({
  name: sliceNames.CREATE,
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderCall = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.orderCall = false;
          state.order = action.payload.order;
        }
      )
      .addCase(createOrder.rejected, (state) => {
        state.orderCall = false;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.orderCall = false;
          state.orderByNumber = action.payload.orders;
        }
      );
  }
});

// Селекторы
export const { clearOrder } = newOrderSlice.actions;

export const selectUserOrder = (state: RootState) =>
  (state[sliceNames.CREATE] as TCreateState).order;

export const selectOrderCall = (state: RootState) =>
  (state[sliceNames.CREATE] as TCreateState).orderCall;

export const selectOrderByNumber = (state: RootState) =>
  (state[sliceNames.CREATE] as TCreateState).orderByNumber;
