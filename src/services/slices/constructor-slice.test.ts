import { v4 as uuidv4 } from 'uuid';
import {
  constructorSlice,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientUpAndDown
} from './constructor-slice';

describe('Проверка работы constructor', () => {
  // Общие тестовые случайные данные
  const mockTestBun = {
    id: 'test-bun-id', // Фиксированный ID для тестов
    _id: '0',
    type: 'bun',
    name: 'Булка 1',
    price: 125,
    image: '',
    image_mobile: '',
    image_large: '',
    calories: 400,
    proteins: 80,
    fat: 25,
    carbohydrates: 50
  };

  const mockTestIngredients = [
    {
      id: 'test-ingredient-id-1',
      _id: '1',
      type: 'main',
      name: 'Ингредиент 1',
      price: 100,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 40,
      proteins: 10,
      fat: 10,
      carbohydrates: 10
    },
    {
      id: 'test-ingredient-id-2',
      _id: '2',
      type: 'main',
      name: 'Ингредиент 2',
      price: 200,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 220,
      proteins: 20,
      fat: 15,
      carbohydrates: 15
    },
    {
      id: 'test-ingredient-id-3',
      _id: '3',
      type: 'main',
      name: 'Ингредиент 3',
      price: 90,
      image: '',
      image_mobile: '',
      image_large: '',
      calories: 150,
      proteins: 13,
      fat: 13,
      carbohydrates: 13
    }
  ];

  const initialTestState = {
    bun: null,
    constructorIngredients: []
  };

  describe('Добавление компонентов', () => {
    it('добавление булки', () => {
      const state = constructorSlice.reducer(
        initialTestState, 
        addIngredientToConstructor(mockTestBun)
      );

      expect(state.bun).toMatchObject({
        _id: mockTestBun._id,
      });;
      expect(state.constructorIngredients).toHaveLength(0);
    });
  
    it('добавление ингредиентов', () => {
      const state = constructorSlice.reducer(
        initialTestState,
        addIngredientToConstructor(mockTestIngredients[0])
      );

      expect(state.constructorIngredients).toHaveLength(1);
      expect(state.constructorIngredients[0]).toMatchObject({
        _id: mockTestIngredients[0]._id,
      });
    });

    it('замена булки на новую булку', () => {
      const alternativeBun = {
        ...mockTestBun,
        _id: '2',
        name: 'Булка 2'
      };
      const stateWithBun = {
        ...initialTestState,
        bun: mockTestBun
      };
      const state = constructorSlice.reducer(
        stateWithBun,
        addIngredientToConstructor(alternativeBun)
      );

      expect(state.bun).toMatchObject({
        _id: alternativeBun._id,
      });
      expect(state.bun).not.toEqual(mockTestBun);
    });
  });

  describe('Удаление ингредиентов', () => {
    it('удаляет ингредиент из конструктора', () => {
      const stateWithFillings = {
        ...initialTestState,
        constructorIngredients: [...mockTestIngredients]
      };
      const state = constructorSlice.reducer(
        stateWithFillings,
        removeIngredientFromConstructor(mockTestIngredients[1])
      );
      
      expect(state.constructorIngredients).toHaveLength(2);
      expect(state.constructorIngredients).not.toContainEqual(mockTestIngredients[1]);
    });

    it('не изменяет состояние при удалении отсутствующего компонента', () => {
      const missingComponent = {
        ...mockTestIngredients[0],
        id: uuidv4()
      };
      const stateWithFillings = {
        ...initialTestState,
        constructorIngredients: [...mockTestIngredients]
      };
      const state = constructorSlice.reducer(
        stateWithFillings,
        removeIngredientFromConstructor(missingComponent)
      );
      
      expect(state.constructorIngredients).toHaveLength(3);
    });
  });

  describe('Изменение порядка ингредиентов', () => {
    it('перемещает компонент ниже по списку', () => {
      const stateWithFillings = {
        ...initialTestState,
        constructorIngredients: [...mockTestIngredients]
      };
      const state = constructorSlice.reducer(
        stateWithFillings,
        moveIngredientUpAndDown({ from: 0, to: 1 })
      );
      
      expect(state.constructorIngredients[0]).toEqual(mockTestIngredients[1]);
      expect(state.constructorIngredients[1]).toEqual(mockTestIngredients[0]);
      expect(state.constructorIngredients[2]).toEqual(mockTestIngredients[2]);
    });

    it('перемещает компонент выше по списку', () => {
      const stateWithFillings = {
        ...initialTestState,
        constructorIngredients: [...mockTestIngredients]
      };
      const state = constructorSlice.reducer(
        stateWithFillings,
        moveIngredientUpAndDown({ from: 2, to: 0 })
      );
      
      expect(state.constructorIngredients[0]).toEqual(mockTestIngredients[2]);
      expect(state.constructorIngredients[1]).toEqual(mockTestIngredients[0]);
      expect(state.constructorIngredients[2]).toEqual(mockTestIngredients[1]);
    });

    it('оставляет порядок неизменным при одинаковых позициях', () => {
      const stateWithFillings = {
        ...initialTestState,
        constructorIngredients: [...mockTestIngredients]
      };
      const state = constructorSlice.reducer(
        stateWithFillings,
        moveIngredientUpAndDown({ from: 1, to: 1 })
      );
      
      expect(state.constructorIngredients).toEqual(mockTestIngredients);
    });
  });
});
