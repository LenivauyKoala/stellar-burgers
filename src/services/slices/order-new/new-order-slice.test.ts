import { PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { TNewOrderResponse } from '@api';
import { createOrder } from '../order/orders-thunks';
import { newOrderSlice, TCreateState, clearOrder, initialState } from './new-order-slice';

 const mockOrderData: TOrder = {
  _id: '1',
  status: 'pending',
  name: 'Тестовый заказ',
  createdAt: '2025-04-10T12:00:00Z',
  updatedAt: '2025-04-10T12:00:00Z',
  number: 1,
  ingredients: ['1', '1'],
};

const mockResponse: TNewOrderResponse = {
  success: true,
  order: mockOrderData,
  name: 'Тестовый заказ',
};

describe('Проверка работы newOrder', () => {
  it('установка orderCall в true при pending-запросе', () => {
    const action = { type: createOrder.pending.type };
    const state = newOrderSlice.reducer(initialState, action);

    expect(state.orderCall).toBe(true);
    expect(state.order).toBeNull();
    expect(state.orderByNumber).toBeNull();
  });

  it('корректная запись заказа при fulfilled-запросе', () => {
    const action: PayloadAction<TNewOrderResponse> = {
      type: createOrder.fulfilled.type,
      payload: mockResponse,
    };
    const state = newOrderSlice.reducer(initialState, action);

    expect(state.orderCall).toBe(false);
    expect(state.order).toEqual(mockOrderData);
    expect(state.orderByNumber).toBeNull();
  });

  it('очистка заказа через clearOrder', () => {
    const stateBefore: TCreateState = {
      ...initialState,
      order: mockOrderData,
    };
    const action = clearOrder();
    const state = newOrderSlice.reducer(stateBefore, action);

    expect(state.order).toBeNull();
    expect(state.orderCall).toBe(false);
    expect(state.orderByNumber).toBeNull();
  });

  it('установка orderCall в false при rejected-запросе', () => {
    const action = { type: createOrder.rejected.type };
    const state = newOrderSlice.reducer(initialState, action);

    expect(state.orderCall).toBe(false);
    expect(state.order).toBeNull();
    expect(state.orderByNumber).toBeNull();
  });
});