//Исправилнения
//Когд пропадет значит
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { TUserResponse } from '@api';
import { RootState } from 'src/services/store';
import { sliceNames } from '../slices-name';

export interface TUserState {
  data: TUser | null;
  isAuthChecked: boolean;
  isValidate: boolean;
  isLoginUserLoading: boolean;
  error: string;
}

const initialState: TUserState = {
  data: null,
  isAuthChecked: false,
  isValidate: false,
  isLoginUserLoading: false,
  error: ''
};

export const userSlice = createSlice({
  name: sliceNames.USER,
  initialState,
  reducers: {
    checkUser: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
      state.isValidate = false;
      state.isAuthChecked = false;
      state.error = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action): action is PayloadAction<TUserResponse> =>
          action.type.startsWith('user/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoginUserLoading = true;
          state.error = '';
        }
      )
      .addMatcher(
        (action): action is PayloadAction<TUserResponse> =>
          action.type.startsWith('user/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (action.payload?.user) {
            state.data = action.payload.user;
            state.isValidate = true;
            state.isAuthChecked = true;
          } else {
            state.data = null;
            state.isValidate = false;
            state.isAuthChecked = true;
          }
          state.isLoginUserLoading = false;
          state.error = '';
        }
      )
      .addMatcher(
        (action): action is PayloadAction<string> =>
          action.type.startsWith('user/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.isLoginUserLoading = false;
          state.isAuthChecked = true;
          state.error = action.payload;
        }
      );
  }
});

export const { checkUser, userLogout } = userSlice.actions;

export const selectUserData = (state: RootState) =>
  (state[sliceNames.USER] as TUserState).data;

export const selectAuthChecked = (state: RootState) =>
  (state[sliceNames.USER] as TUserState).isAuthChecked;

export const selectValidate = (state: RootState) =>
  (state[sliceNames.USER] as TUserState).isValidate;

export const selectloginUserLoading = (state: RootState) =>
  (state[sliceNames.USER] as TUserState).isLoginUserLoading;

export const selectErrorRequest = (state: RootState) =>
  (state[sliceNames.USER] as TUserState).error;
