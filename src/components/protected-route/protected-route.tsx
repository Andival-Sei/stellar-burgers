import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: JSX.Element;
};

// Компонент защищает маршруты: если onlyUnAuth=true, то не пускаю авторизованных
// иначе — требую авторизацию, иначе редирект на /login с сохранением откуда пришли
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((s) => s.user);

  if (!isAuthChecked) {
    // Можно отрисовать простой «заглушку», пока проверяем авторизацию
    return null;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string })?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return element;
};
