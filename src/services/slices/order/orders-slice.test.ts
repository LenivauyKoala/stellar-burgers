import { TFeedsResponse } from '@api';
import { orderSlice } from './orders-slice';
import { sliceNames } from '../../slices/slices-name';

const initialTestState = {
  userOrder: [],
  isLoading: false
};

const mockOrdersData: TFeedsResponse = {
  success: true,
  orders: [{ 
    _id: '1', 
    name: 'Тестовый заказ', 
    status: 'done', 
    createdAt: '', 
    updatedAt: '', 
    number: 1, 
    ingredients: [] 
  }],
  total: 150,
  totalToday: 15
};

describe('Проверка работы order', () => {
  it('установка isLoading в true при pending-запросе', () => {
    const action = { type: `${sliceNames.ORDER}/getUserOrders/pending` };
    const state = orderSlice.reducer(initialTestState, action);

    expect(state.isLoading).toBe(true);
    expect(state.userOrder).toEqual(initialTestState.userOrder); // проверка, что другие поля не изменились
  });

  it('корректная обработка успешного запроса (fulfilled)', () => {
    const action = {
      type: `${sliceNames.ORDER}/getUserOrders/fulfilled`,
      payload: mockOrdersData
    };
    const state = orderSlice.reducer(initialTestState, action);

    expect(state.isLoading).toBe(false);
    expect(state.userOrder).toEqual(mockOrdersData.orders);
  });

  it('перевод userOrders в пустой массив, если orders отсутствуют', () => {
    const action = { 
      type: `${sliceNames.ORDER}/getUserOrders/fulfilled`,
      payload: { ...mockOrdersData, orders: [] }
    };
    const state = orderSlice.reducer(initialTestState, action);

    expect(state.isLoading).toBe(false);
    expect(state.userOrder).toBeDefined();
    expect(state.userOrder).toEqual([]);
  });

  it('обработка ошибки при rejected-запросе', () => {
    const action = { type: `${sliceNames.ORDER}/getUserOrders/rejected` };
    const state = orderSlice.reducer(initialTestState, action);

    expect(state.isLoading).toBe(false);
    expect(state.userOrder).toEqual(initialTestState.userOrder);
  });
});
