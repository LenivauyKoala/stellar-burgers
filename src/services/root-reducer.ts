import { combineReducers } from '@reduxjs/toolkit';

import { constructorSlice } from '../services/slices/constructor-slice';
import { ingredientsSlice } from '../services/slices/ingredients/ingredients-slice';
import { feedSlice } from '../services/slices/feed/feed-slice';
import { userSlice } from '../services/slices/user/user-slice';
import { orderSlice } from '../services/slices/order/orders-slice';
import { newOrderSlice } from '../services/slices/order-new/new-order-slice';

export const rootReducer = combineReducers({
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [newOrderSlice.name]: newOrderSlice.reducer
});
