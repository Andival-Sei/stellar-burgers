import '../../index.css';
import styles from './app.module.css';

import { AppHeader, ProtectedRoute } from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal } from '@components';
import { IngredientDetails } from '@components';
import { OrderInfo } from '@components';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '@slices/ingredients';
import { fetchUser, setAuthChecked } from '@slices/user';

const App = () => {
  // Инициализирую необходимые данные при загрузке приложения
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: any } | undefined;

  useEffect(() => {
    // Загружаю ингредиенты сразу
    dispatch(fetchIngredients());
    // Проверяю пользователя, если есть токены — подтянется, иначе просто отметим проверку
    dispatch(fetchUser()).finally(() => dispatch(setAuthChecked(true)));
  }, [dispatch]);

  // Закрываю модалку возвратом на предыдущий маршрут
  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
