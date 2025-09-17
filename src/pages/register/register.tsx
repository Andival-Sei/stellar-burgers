import { FC, SyntheticEvent, useEffect, useState } from 'react';
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

export const Register: FC = () => {
  const [form, onChange] = useForm({ name: '', email: '', password: '' });
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

  return (
    <RegisterUI
      errorText={error || ''}
      email={form.email}
      userName={form.name}
      password={form.password}
      setEmail={
        ((value: SetStateAction<string>) => {
          const next = typeof value === 'function' ? value(form.email) : value;
          onChange({ target: { name: 'email', value: next } } as any);
        }) as Dispatch<SetStateAction<string>>
      }
      setPassword={
        ((value: SetStateAction<string>) => {
          const next =
            typeof value === 'function' ? value(form.password) : value;
          onChange({ target: { name: 'password', value: next } } as any);
        }) as Dispatch<SetStateAction<string>>
      }
      setUserName={
        ((value: SetStateAction<string>) => {
          const next = typeof value === 'function' ? value(form.name) : value;
          onChange({ target: { name: 'name', value: next } } as any);
        }) as Dispatch<SetStateAction<string>>
      }
      handleSubmit={handleSubmit}
    />
  );
};
