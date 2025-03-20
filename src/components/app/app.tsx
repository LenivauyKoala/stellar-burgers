import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';

import { ProtectedRoute } from '../protected/protected-route';
import { getIngredients } from '../../services/slices/ingredients/ingredients-slice';
import { getUser } from '../../services/slices/user/user-thunks';
import {
  checkUser,
  selectUserData
} from '../../services/slices/user/user-slice';

import {
  selectIngredients,
  selectIsLoading
} from '../../services/slices/ingredients/ingredients-slice'; // Импортируем селекторы

import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const userName = user?.name;

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser())
      .unwrap()
      .catch(() => {})
      .finally(() => checkUser());
  }, [dispatch]);

  // Если данные еще загружаются, показываем лоадер
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  // Если ингредиенты не загружены (например, произошла ошибка), показываем сообщение
  if (!ingredients.length) {
    return <div>Ошибка!</div>;
  }

  return (
    <div className={styles.app}>
      <AppHeader userName={userName} />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute isAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute isAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute isAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute isAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
