import React from 'react';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectAuthChecked,
  selectUserData
} from '../../services/slices/user/user-slice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuth?: boolean;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

const ROUTES = {
  HOME: '/',
  LOGIN: '/login'
};

export const ProtectedRoute = ({ children, isAuth }: ProtectedRouteProps) => {
  const user = useSelector(selectUserData);
  const isAuthChecked = useSelector(selectAuthChecked);
  const location = useLocation() as { state: LocationState };

  const renderPreloader = () => <Preloader />;

  const redirectToHome = () => {
    const from = location.state?.from || { pathname: ROUTES.HOME };
    return <Navigate to={from} />;
  };

  const redirectToLogin = () => (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} />
  );

  // Если проверка авторизации еще не завершена, показываем прелоадер
  if (!isAuthChecked) {
    return renderPreloader();
  }

  // Если маршрут публичный и пользователь авторизован, перенаправляем его на главную страницу
  if (isAuth && user) {
    return redirectToHome();
  }

  // Если маршрут не публичный и пользователь не авторизован, перенаправляем его на страницу логина
  if (!isAuth && !user) {
    return redirectToLogin();
  }

  // Если все проверки пройдены, рендерим children
  return children;
};
