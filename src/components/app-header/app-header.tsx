import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '@selectors/user';

export const AppHeader: FC = () => {
  // Показываю имя пользователя, если он авторизован
  const user = useSelector(selectUser);
  return <AppHeaderUI userName={user?.name || ''} />;
};
