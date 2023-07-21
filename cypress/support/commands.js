Cypress.Commands.add('busca', texto => {
    cy.get('.interactions input[type="text"]')
    .should('be.visible')
    .clear()
    .type(`${texto} {enter}`)
})
