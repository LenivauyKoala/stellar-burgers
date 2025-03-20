import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';

import { selectUserOrders } from '../../services/slices/order/orders-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
