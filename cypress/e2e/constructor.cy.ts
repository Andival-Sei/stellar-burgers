const apiBaseUrl = Cypress.env('apiBaseUrl');

const addIngredientToConstructor = (name: string) => {
  cy.contains('[data-cy=ingredient-card]', name)
    .should('exist')
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiBaseUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${apiBaseUrl}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', `${apiBaseUrl}/orders`, (req) => {
      expect(req.body).to.have.property('ingredients');
      req.reply({ fixture: 'order.json' });
    }).as('createOrder');

    cy.intercept('POST', `${apiBaseUrl}/auth/token`, {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer mocked-access-token',
        refreshToken: 'mocked-refresh-token'
      }
    }).as('refreshToken');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=Bearer test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());
  });

  it('добавляет булку и начинку в конструктор', () => {
    addIngredientToConstructor('Краторная булка');
    addIngredientToConstructor('Мясо бессмертных моллюсков');

    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Краторная булка (верх)'
    );
    cy.get('[data-cy=constructor-item]')
      .should('have.length', 1)
      .first()
      .should('contain.text', 'Мясо бессмертных моллюсков');
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Краторная булка (низ)'
    );
  });

  it('открывает и закрывает модальное окно ингредиента по кнопке и оверлею', () => {
    cy.contains('[data-cy=ingredient-card]', 'Краторная булка')
      .find('[data-cy=ingredient-link]')
      .click();

    cy.get('[data-cy=modal]')
      .should('be.visible')
      .and('contain.text', 'Краторная булка');

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-cy=ingredient-card]').should('have.length.at.least', 1);
    cy.get('[data-cy=ingredient-card]')
      .eq(2)
      .find('[data-cy=ingredient-link]')
      .click();

    cy.get('[data-cy=modal]')
      .should('be.visible')
      .and('contain.text', 'Мясо бессмертных моллюсков');
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('создает заказ и очищает конструктор после закрытия модалки', () => {
    addIngredientToConstructor('Краторная булка');
    addIngredientToConstructor('Мясо бессмертных моллюсков');
    addIngredientToConstructor('Соус с шипами антории');

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder').then(({ request, response }) => {
      const body = request.body as { ingredients: string[] };
      expect(body.ingredients).to.have.length(4);

      expect(response?.statusCode).to.eq(200);
      const orderBody = response?.body as
        | { order: { number: number } }
        | undefined;
      expect(orderBody?.order.number).to.eq(445533);
    });

    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('have.text', '445533');

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=constructor-item]').should('have.length', 0);
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Выберите булки'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'contain.text',
      'Выберите начинку'
    );
  });
});
