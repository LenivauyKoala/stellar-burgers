import { rootReducer } from './root-reducer';
import { store } from './store';    
import { feedSlice } from '../services/slices/feed/feed-slice';
import { ingredientsSlice } from '../services/slices/ingredients/ingredients-slice';
import { orderSlice } from '../services/slices/order/orders-slice';
import { newOrderSlice } from '../services/slices/order-new/new-order-slice';
import { userSlice } from '../services/slices/user/user-slice';
import { constructorSlice } from '../services/slices/constructor-slice';

describe('Проверка rootReducer и store', () => {
  const UNKNOWN_ACTION = { type: 'UNKNOWN_ACTION' };

  it('должен инициализировать store со всеми слайсами', () => {
    const state = store.getState();

    // Проверяем, что каждый слайс присутствует в состоянии
    expect(state).toHaveProperty(feedSlice.name);
    expect(state).toHaveProperty(ingredientsSlice.name);
    expect(state).toHaveProperty(orderSlice.name);
    expect(state).toHaveProperty(newOrderSlice.name);
    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(constructorSlice.name);

  });

  it('должен возвращать начальное состояние для всех слайсов при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, UNKNOWN_ACTION);

    // Проверяем, что начальное состояние каждого слайса соответствует его getInitialState()
    expect(initialState[feedSlice.name]).toEqual(feedSlice.getInitialState());
    expect(initialState[ingredientsSlice.name]).toEqual(ingredientsSlice.getInitialState());
    expect(initialState[orderSlice.name]).toEqual(orderSlice.getInitialState());
    expect(initialState[newOrderSlice.name]).toEqual(newOrderSlice.getInitialState());
    expect(initialState[userSlice.name]).toEqual(userSlice.getInitialState());
    expect(initialState[constructorSlice.name]).toEqual(constructorSlice.getInitialState());
  });
});