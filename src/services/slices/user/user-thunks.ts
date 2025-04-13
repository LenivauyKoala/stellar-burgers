import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  getUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TUserResponse,
  TAuthResponse,
  TRegisterData,
  TServerResponse
} from '@api';
import { deleteCookie, setCookie } from '../../../utils/cookie';
import { userLogout } from './user-slice';
import { sliceNames } from '../slices-name';

const errorMessages = {
  USER_EXISTS: 'Данный пользователь уже зарегистрирован',
  REGISTRATION_ERROR: 'Ошибка при регистрации',
  LOGIN_ERROR: 'Ошибка при входе в систему',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка'
};

// Устанавливает токены в cookie и localStorage
const setAuthTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getUser = createAsyncThunk<TUserResponse, void>(
  `${sliceNames.USER}/getUser`,
  async () => await getUserApi()
);

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  `${sliceNames.USER}/registerUser`,
  async (dataUser: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(dataUser);
      setAuthTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User already exists') {
        return rejectWithValue(errorMessages.USER_EXISTS);
      }
      return rejectWithValue(errorMessages.REGISTRATION_ERROR);
    }
  }
);

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  `${sliceNames.USER}/login`,
  async (dataUser: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(dataUser);
      setAuthTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error: unknown) {
      return rejectWithValue(errorMessages.LOGIN_ERROR);
    }
  }
);

export const logoutUser = createAsyncThunk(
  `${sliceNames.USER}/logoutUser`,
  async (_, { dispatch }) => {
    await logoutApi();
    localStorage.clear();
    deleteCookie('accessToken');
    dispatch(userLogout());
  }
);

export const updateUser = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>
>(
  `${sliceNames.USER}/updateUser`,
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(userData);
    } catch (error: unknown) {
      return rejectWithValue(errorMessages.UNKNOWN_ERROR);
    }
  }
);

export const forgotPassword = createAsyncThunk<
  TServerResponse<{}>,
  { email: string }
>(
  `${sliceNames.USER}/forgotpassword`,
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(data);
    } catch (error: unknown) {
      return rejectWithValue(errorMessages.UNKNOWN_ERROR);
    }
  }
);

export const resetPassword = createAsyncThunk<
  TServerResponse<{}>,
  { password: string; token: string }
>(
  `${sliceNames.USER}/resetPassword`,
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      return await resetPasswordApi(data);
    } catch (error: unknown) {
      return rejectWithValue(errorMessages.UNKNOWN_ERROR);
    }
  }
);
