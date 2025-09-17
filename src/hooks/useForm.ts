import { ChangeEvent, useState } from 'react';

// Простой переиспользуемый хук для управления значениями форм
export function useForm<T extends { [key: string]: string }>(baseForm: T) {
  const [values, setValues] = useState<T>(baseForm);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return [values, handleChange, setValues] as const;
}
