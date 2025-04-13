import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

import {
  clearConstructor,
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/slices/constructor-slice';
import { createOrder } from '../../services/slices/order/orders-thunks';
import {
  clearOrder,
  selectOrderCall,
  selectUserOrder
} from '../../services/slices/order-new/new-order-slice';
import { selectUserData } from '../../services/slices/user/user-slice';
import { console } from 'inspector';

export const BurgerConstructor: FC = () => {
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const order = useSelector(selectUserOrder);
  const orderCall = useSelector(selectOrderCall);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUserData);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const orderModalData = order;

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderCall) return;

    const orderIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.bun._id
    ];
    dispatch(createOrder({ data: orderIngredients }));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderCall}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
