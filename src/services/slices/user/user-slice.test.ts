import { TUserResponse } from '@api';
import { userSlice, checkUser, userLogout, initialState } from './user-slice';
import { sliceNames } from '../slices-name';

describe('Проверка работы user', () => {
  describe('Проверка синхронных операций', () => {
    it('при проверке пользователя должен устанавливаться флаг проверки', () => {
      const state = userSlice.reducer(initialState, checkUser());

      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true
      });
    });

    it('при выходе должны сбрасываться все данные пользователя', () => {
      const loggedInState = {
        ...initialState,
        data: { name: 'Hopsi', email: 'e2e-TEST@test.ru' },
        isValidate: true,
        isAuthChecked: true,
        error: 'Произошла ошибка'
      };
      const resetState = userSlice.reducer(loggedInState, userLogout());

      expect(resetState).toEqual(initialState);
    });
  });

  describe('Проверка асинхронных операций', () => {
    it('при начале загрузки должен устанавливаться флаг загрузки', () => {
      const action = { type: `${sliceNames.USER}/loginUser/pending` };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoginUserLoading: true
      });
    });

    describe('Проверка успешного завершения', () => {
      const mockTestUser = { name: 'Hopsi', email: 'e2e-TEST@test.ru' };

      it('при успешной авторизации должны обновиться данные', () => {
        const mockResponse: TUserResponse = {
          success: true,
          user: mockTestUser
        };
        const action = { 
          type: `${sliceNames.USER}/loginUser/fulfilled`, 
          payload: mockResponse 
        };
        const state = userSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoginUserLoading: false,
          isValidate: true,
          isAuthChecked: true,
          data: mockTestUser
        });
      });

      it('при отсутствии пользователя должен сбрасываться в null', () => {
        const action = { 
          type: `${sliceNames.USER}/loginUser/fulfilled`, 
          payload: { success: true, user: null } 
        };
        const state = userSlice.reducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoginUserLoading: false,
          isAuthChecked: true,
          isValidate: false,
          data: null
        });
      });
    });

    it('при ошибке должен сохраняться текст ошибки', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = { 
        type: `${sliceNames.USER}/loginUser/rejected`, 
        payload: errorMessage 
      };
      const state = userSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoginUserLoading: false,
        isAuthChecked: true,
        error: errorMessage
      });
    });
  });
});