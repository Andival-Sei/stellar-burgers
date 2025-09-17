import { FC, SyntheticEvent, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '@slices/user';
import {
  selectUser,
  selectUserLoading,
  selectUserError
} from '@selectors/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const [form, onChange] = useForm({ email: '', password: '' });
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: form.email, password: form.password }));
  };

  useEffect(() => {
    if (user && !isLoading) {
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location.state]);

  return (
    <LoginUI
      errorText={error || ''}
      email={form.email}
      setEmail={
        ((value: SetStateAction<string>) => {
          const next = typeof value === 'function' ? value(form.email) : value;
          onChange({ target: { name: 'email', value: next } } as any);
        }) as Dispatch<SetStateAction<string>>
      }
      password={form.password}
      setPassword={
        ((value: SetStateAction<string>) => {
          const next =
            typeof value === 'function' ? value(form.password) : value;
          onChange({ target: { name: 'password', value: next } } as any);
        }) as Dispatch<SetStateAction<string>>
      }
      handleSubmit={handleSubmit}
    />
  );
};
