import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';

import {
  removeIngredientFromConstructor,
  moveIngredientUpAndDown
} from '../../services/slices/constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = (fromIndex: number) => {
      dispatch(moveIngredientUpAndDown({ from: fromIndex, to: fromIndex + 1 }));
    };

    const handleMoveUp = (fromIndex: number) => {
      dispatch(moveIngredientUpAndDown({ from: fromIndex, to: fromIndex - 1 }));
    };

    const handleClose = () => {
      dispatch(removeIngredientFromConstructor(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={() => handleMoveUp(index)}
        handleMoveDown={() => handleMoveDown(index)}
        handleClose={handleClose}
      />
    );
  }
);
