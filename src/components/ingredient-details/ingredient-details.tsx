import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredientById } from '@selectors/ingredients';

export const IngredientDetails: FC = () => {
  // Извлекаю id из URL и достаю ингредиент из стора по id
  const { id } = useParams();
  const ingredientData = useSelector(
    id ? selectIngredientById(id) : () => null
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
