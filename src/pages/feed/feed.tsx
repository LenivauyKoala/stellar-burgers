import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  selectIsLoading,
  selectOrders
} from '../../services/slices/feed/feed-slice';
import { getFeed } from '../../services/slices/feed/feed-thunks';
import { getUserOrders } from '../../services/slices/order/orders-thunks';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getFeed());
    dispatch(getUserOrders());
  }, []);

  if (!orders?.length || isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeed())} />;
};
