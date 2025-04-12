describe('Функциональность конструктора бургера', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:4000/');
  });

  //Пути где искать data-cy
  //src/components/ui/burger-ingredients/burger-ingredients.tsx
  //src/components/ui/burger-constructor/burger-constructor.tsx
  it('должны корректно добавляться булки', function () {
    cy.get('[data-cy=list-bun]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]')
      .contains('Булка 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-bot]')
      .contains('Булка 1')
      .should('exist');
  });

  //Пути где искать data-cy
  //src/components/ui/burger-ingredients/burger-ingredients.tsx
  //src/components/ui/burger-constructor/burger-constructor.tsx
  it('должны добавляться основные ингредиенты и соусы', function () {
    cy.get('[data-cy=list-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=list-sauces]').contains('Добавить').click();
    cy.get('[data-cy=constructor-filling]')
      .contains('Ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-filling]')
      .contains('Соус 1')
      .should('exist');
  });
});

describe('Взаимодействие с модальными окнами', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:4000/');
  });

  //Пути где искать data-cy
  //src/components/ui/modal/modal.tsx
  it('должно отображаться окно с деталями ингредиентов', function () {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal]').contains('Булка 1').should('exist');
  });

  //Пути где искать data-cy
  //src/components/ui/modal/modal.tsx
  it('должно закрываться по клику на иконку закрытия', function () {
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal] button').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  //Пути где искать data-cy
  //src/components/ui/modal-overlay/modal-overlay.tsx
  it('должно закрываться по клику вне модального окна', function () {
    cy.contains('Булка 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('right', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
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
    cy.visit('http://localhost:4000');
  });

  //data-cy пути для поиска прописаны выше
  it('заказ оформляется корректно', function () {
    cy.get('[data-cy=list-bun]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-top]')
      .contains('Булка 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-bot]')
      .contains('Булка 1')
      .should('exist');
    cy.get('[data-cy=list-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=list-sauces]').contains('Добавить').click();
    cy.get('[data-cy=constructor-filling]')
      .contains('Ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-filling]')
      .contains('Соус 1')
      .should('exist');
    cy.get('[data-cy=order-create]').contains('Оформить заказ').click();
    cy.get('[data-cy=modal]').contains('70000').should('exist');
    cy.get('[data-cy=modal] button').click();
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bot]').should('not.exist');
    cy.get('[data-cy=constructor-filling]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy=constructor-filling]')
      .contains('Соус 1')
      .should('not.exist');
  });
});
afterEach(function () {
  cy.clearLocalStorage();
  cy.clearCookies();
});