import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';
import { sliceNames } from '../slices-name';

export const getFeed = createAsyncThunk<TFeedsResponse, void>(
  `${sliceNames.FEED}/getFeed`,
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
