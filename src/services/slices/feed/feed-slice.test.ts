import { TFeedsResponse } from '@api';
import { feedSlice, initialState } from './feed-slice';

// Моковые данные для теста успешного ответа
const mockFeedData: TFeedsResponse = {
  success: true,
  orders: [],
  total: 150,
  totalToday: 15
};

describe('Проверка работы feedSlice', () => {
  it('должен установить isLoading в true при начале загрузки данных', () => {
    const action = { type: 'feed/getFeed/pending' };
    const state = feedSlice.reducer(initialState, action);

    expect(state.isLoading).toBeTruthy();
  });

  it('должен корректно обработать успешный ответ и обновить состояние', () => {
    const action = { type: 'feed/getFeed/fulfilled', payload: mockFeedData };
    const state = feedSlice.reducer(initialState, action);

    expect(state.isLoading).toBeFalsy();
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(150);
    expect(state.totalToday).toBe(15);
  });

  it('должен сбросить isLoading при ошибке загрузки', () => {
    const action = { type: 'feed/getFeed/rejected' };
    const state = feedSlice.reducer(initialState, action);
    
    expect(state.isLoading).toBeFalsy();
  });
});