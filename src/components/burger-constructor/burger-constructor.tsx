import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '@selectors/constructor';
import { selectOrderRequest, selectOrderData } from '@selectors/order';
import { clearConstructor } from '@slices/constructor';
import { createOrder, clearOrder } from '@slices/order';
import { selectUser } from '@selectors/user';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  const onOrderClick = () => {
    // Если не авторизован — отправляю на логин
    if (!user) {
      navigate('/login');
      return;
    }
    // Если нет булки или уже отправляем — выхожу
    if (!constructorItems.bun || orderRequest) return;
    // Готовлю массив id ингредиентов для заказа (включая булку дважды по правилам)
    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };
  const closeOrderModal = () => {
    // После успешного заказа очищаю конструктор
    if (orderModalData) {
      dispatch(clearConstructor());
      // Сбрасываю данные заказа, чтобы скрыть модалку
      dispatch(clearOrder());
    }
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
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
