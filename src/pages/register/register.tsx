import { FC, SyntheticEvent, useCallback, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '@slices/user';
import {
  selectUser,
  selectUserError,
  selectUserLoading
} from '@selectors/user';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import type { Dispatch, SetStateAction } from 'react';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const Register: FC = () => {
  const [form, , setFormValues] = useForm<RegisterForm>({
    name: '',
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      })
    );
  };

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

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

  const setUserName = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setFormValues((prev) => {
        const nextValue =
          typeof value === 'function' ? value(prev.name) : value;

        if (prev.name === nextValue) {
          return prev;
        }

        return { ...prev, name: nextValue };
      });
    },
    [setFormValues]
  );

  return (
    <RegisterUI
      errorText={error || ''}
      email={form.email}
      userName={form.name}
      password={form.password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
