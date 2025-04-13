// Константы для селекторов data-cy
const SELECTORS = {
  LIST_BUN: '[data-cy=list-bun]',
  LIST_INGREDIENTS: '[data-cy=list-ingredients]',
  LIST_SAUCES: '[data-cy=list-sauces]',
  CONSTRUCTOR_BUN_TOP: '[data-cy=constructor-bun-top]',
  CONSTRUCTOR_BUN_BOT: '[data-cy=constructor-bun-bot]',
  CONSTRUCTOR_FILLING: '[data-cy=constructor-filling]',
  MODAL: '[data-cy=modal]',
  MODAL_OVERLAY: '[data-cy=modal-overlay]',
  ORDER_CREATE: '[data-cy=order-create]'
};

// Константы для элементов
const ELEMENTS = {
  BUN_1: 'Булка 1',
  INGREDIENT_1: 'Ингредиент 1',
  SAUCE_1: 'Соус 1',
  ORDER_DETAILS: 'Детали ингредиента',
  ADD_BUTTON: 'Добавить',
  ORDER_BUTTON: 'Оформить заказ',
  ORDER_NUMBER: '70000'
};

describe('Функциональность конструктора бургера', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  //Пути где искать data-cy
  //src/components/ui/burger-ingredients/burger-ingredients.tsx
  //src/components/ui/burger-constructor/burger-constructor.tsx
  it('должны корректно добавляться булки', function () {
    cy.get(SELECTORS.LIST_BUN).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP)
      .contains(ELEMENTS.BUN_1)
      .should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOT)
      .contains(ELEMENTS.BUN_1)
      .should('exist');
  });

  //Пути где искать data-cy
  //src/components/ui/burger-ingredients/burger-ingredients.tsx
  //src/components/ui/burger-constructor/burger-constructor.tsx
  it('должны добавляться основные ингредиенты и соусы', function () {
    cy.get(SELECTORS.LIST_INGREDIENTS).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.LIST_SAUCES).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.INGREDIENT_1)
      .should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.SAUCE_1)
      .should('exist');
  });
});

describe('Взаимодействие с модальными окнами', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  //Пути где искать data-cy
  //src/components/ui/modal/modal.tsx
  it('должно отображаться окно с деталями ингредиентов', function () {
    cy.contains(ELEMENTS.ORDER_DETAILS).should('not.exist');
    cy.contains(ELEMENTS.BUN_1).click();
    cy.contains(ELEMENTS.ORDER_DETAILS).should('exist');
    cy.get(SELECTORS.MODAL).contains(ELEMENTS.BUN_1).should('exist');
  });

  //Пути где искать data-cy
  //src/components/ui/modal/modal.tsx
  it('должно закрываться по клику на иконку закрытия', function () {
    cy.contains(ELEMENTS.BUN_1).click();
    cy.contains(ELEMENTS.ORDER_DETAILS).should('exist');
    cy.get(`${SELECTORS.MODAL} button`).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  //Пути где искать data-cy
  //src/components/ui/modal-overlay/modal-overlay.tsx
  it('должно закрываться по клику вне модального окна', function () {
    cy.contains(ELEMENTS.BUN_1).click();
    cy.contains(ELEMENTS.ORDER_DETAILS).should('exist');
    cy.get(SELECTORS.MODAL_OVERLAY).click('right', { force: true });
    cy.contains(ELEMENTS.ORDER_DETAILS).should('not.exist');
  });
});

describe('Процесс оформления заказа', function () {
  beforeEach(function () {
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('/');
  });

  //data-cy пути для поиска прописаны выше
  it('заказ оформляется корректно', function () {
    cy.get(SELECTORS.LIST_BUN).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP)
      .contains(ELEMENTS.BUN_1)
      .should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOT)
      .contains(ELEMENTS.BUN_1)
      .should('exist');

    cy.get(SELECTORS.LIST_INGREDIENTS).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.LIST_SAUCES).contains(ELEMENTS.ADD_BUTTON).click();
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.INGREDIENT_1)
      .should('exist');
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.SAUCE_1)
      .should('exist');

    cy.get(SELECTORS.ORDER_CREATE).contains(ELEMENTS.ORDER_BUTTON).click();
    cy.get(SELECTORS.MODAL).contains(ELEMENTS.ORDER_NUMBER).should('exist');
    cy.get(`${SELECTORS.MODAL} button`).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOT).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.INGREDIENT_1)
      .should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR_FILLING)
      .contains(ELEMENTS.SAUCE_1)
      .should('not.exist');
  });
});
afterEach(function () {
  cy.clearLocalStorage();
  cy.clearCookies();
});
