import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { sliceNames } from '../slices-name';

export interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
}

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

const isPendingAction = (action: { type: string }): boolean =>
  action.type.startsWith('feed/') && action.type.endsWith('/pending');

const isFulfilledAction = (action: { type: string }): boolean =>
  action.type.startsWith('feed/') && action.type.endsWith('/fulfilled');

const isRejectedAction = (action: { type: string }): boolean =>
  action.type.startsWith('feed/') && action.type.endsWith('/rejected');

export const feedSlice = createSlice({
  name: sliceNames.FEED,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPendingAction, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        isFulfilledAction,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addMatcher(isRejectedAction, (state) => {
        state.isLoading = false;
      });
  }
});

export const selectOrders = (state: RootState) =>
  (state[sliceNames.FEED] as TFeedState).orders;

export const selectIsLoading = (state: RootState) =>
  (state[sliceNames.FEED] as TFeedState).isLoading;
