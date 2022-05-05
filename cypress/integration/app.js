/* global cy,describe,it */

describe('Movies', function () {
  it('frontpage can be opened', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Buscar')
    cy.contains('Buscador de películas')
  })
})
