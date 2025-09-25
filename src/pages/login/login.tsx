import { FC, SyntheticEvent, useCallback, useEffect } from 'react';
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

type LoginForm = {
  email: string;
  password: string;
};

export const Login: FC = () => {
  const [form, , setFormValues] = useForm<LoginForm>({
    email: '',
    password: ''
  });
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

  const setEmail = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setFormValues((prev) => {
        const nextValue =
          typeof value === 'function' ? value(prev.email) : value;

        if (prev.email === nextValue) {
          return prev;
        }

        return { ...prev, email: nextValue };
      });
    },
    [setFormValues]
  );

  const setPassword = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setFormValues((prev) => {
        const nextValue =
          typeof value === 'function' ? value(prev.password) : value;

        if (prev.password === nextValue) {
          return prev;
        }

        return { ...prev, password: nextValue };
      });
    },
    [setFormValues]
  );

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
      setEmail={setEmail}
      password={form.password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
