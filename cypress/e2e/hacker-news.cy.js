describe('Hacker-news', () => {
	const textoInicial = 'redux'

	context('Página Inicial', () => {
		beforeEach(() => {
			cy.intercept({
				method: 'GET',
				pathname: `**/search`,
				query: {
					query: textoInicial,
					page: '0'
				}
			}).as('getItens')

			cy.visit('/')
			cy.wait('@getItens')
		})

		it('Verifica página inicial', () => {
			cy.get('input[type=text]')
				.should('have.value', textoInicial)
			cy.get('form > button[type=submit]')
				.should('contain', 'Search')
			cy.contains('.button-inline', 'Title')
				.should('be.visible')
			cy.contains('.button-inline', 'Author')
				.should('be.visible')
			cy.contains('.button-inline', 'Comments')
				.should('be.visible')
			cy.contains('.button-inline', 'Points')
				.should('be.visible')
			cy.contains('span', 'Archive')
				.should('be.visible')
			cy.get('.interactions')
				.should('contain', 'More')
		})

		it('Verifica itens na página inicial', () => {
			cy.get('.table-row')
				.should('have.length', 100)
		})

		it('Verifica quantos itens ao clicar no "More"', () => {
			cy.get('.table-row')
				.should('have.length', 100)
      cy.get('.interactions button[type=button]')
        .should('be.visible')
        .click()
      cy.get('.table-row')
				.should('have.length', 200)
		})
	})

})