describe('Hacker-news', () => {
  const textoInicial = 'redux'
  const novoTexto = 'javascript'

  context('Página Inicial', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: textoInicial,
          page: '0'
        }
      }).as('getItens')

      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: textoInicial,
          page: '1'
        }
      }).as('getNovosItens')

      cy.intercept(
        'GET',
        `search?query=${novoTexto}%20&page=0&**`
      ).as('getItemDigitado')

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

    it('Verifica quantidade de itens na página inicial', () => {
      cy.get('.table-row')
        .should('have.length', 100)
    })

    it.only('Verificar digitar novo texto e clicar em search', () => {
      cy.busca(novoTexto)
        .wait('@getItemDigitado')
      cy.get('.table-row')
        .should('have.length', 100)
    })

    it('Verifica quantidade de itens ao clicar no "More"', () => {
      cy.get('.table-row')
        .should('have.length', 100)
      cy.get('.interactions button[type=button]')
        .should('be.visible')
        .click()
        .wait('@getNovosItens')
      cy.get('.table-row')
        .should('have.length', 200)
      cy.get('.interactions button[type=button]')
        .should('be.visible')
    })
  })

  context('Mock API', () => {
    const itens = require('../fixtures/itens')

    beforeEach(() => {
      cy.intercept(
        'GET',
        `**/search?query=${textoInicial}&page=0**`,
        { fixture: 'itens' }
      ).as('getItensFix')

      cy.visit('/')
      cy.wait('@getItensFix')
    })

    it('Verifica botão Dismiss', () => {
      cy.get('.table-row')
        .should('have.length', 2)
      cy.contains('button', 'Dismiss')
        .should('be.visible')
        .click()
      cy.get('.table-row')
        .should('have.length', 1)
    })

    context('Verifica o cache', () => {
      beforeEach(() => {
        cy.intercept(
          `**/search?query=${textoInicial}&page=0**`,
          { fixture : 'empty' }
        ).as('empty')

        cy.visit('/')
        cy.wait('@empty')
      })
      
      it.only('Verifica o cache da aplicação', () => {

        const faker = require('faker')
        const aleatorio = faker.random.word()
        let count = 0

        cy.intercept(`**/search?query=${aleatorio}**`, req => {
          count +=1
          req.reply({fixture: 'empty'})
        }).as('random')

        cy.intercept(
          `**/search?query=${novoTexto}**`,
          { fixture: 'itens' }
        ).as('itens')

        cy.busca(aleatorio).then(() => {
          expect(count, `chamada para ${aleatorio}`).to.equal(1)
    
          cy.wait('@random')
    
          cy.busca(novoTexto)
          cy.wait('@itens')
    
          cy.busca(aleatorio).then(() => {
            expect(count, `chamada para ${aleatorio}`).to.equal(1)
          })
        })
      })
    })

    context('Ordenação', () => {
      it('Verifica ordenação por título', () => {
        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[0].title)
          .and('contain', itens.hits[0].author)
          .and('contain', itens.hits[0].num_comments)
          .and('contain', itens.hits[0].points)
        cy.get(`.table-row a:contains(${itens.hits[0].title})`)
          .should('have.attr', 'href', itens.hits[0].url)

        cy.contains('button', 'Title').as('title')
          .should('be.visible')
          .click()
        cy.get('.button-active')
          .should('be.visible')

        cy.get('@title')
          .click()

        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[1].title)
          .and('contain', itens.hits[1].author)
          .and('contain', itens.hits[1].num_comments)
          .and('contain', itens.hits[1].points)
        cy.get(`.table-row a:contains(${itens.hits[1].title})`)
          .should('have.attr', 'href', itens.hits[1].url)
      })

      it('Verifica ordenação por Autor', () => {
        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[0].title)
          .and('contain', itens.hits[0].author)
          .and('contain', itens.hits[0].num_comments)
          .and('contain', itens.hits[0].points)
        cy.get(`.table-row a:contains(${itens.hits[0].title})`)
          .should('have.attr', 'href', itens.hits[0].url)

        cy.contains('button', 'Author').as('autor')
          .should('be.visible')
          .click()
        cy.get('.button-active')
          .should('be.visible')

        cy.get('@autor')
          .click()

        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[1].title)
          .and('contain', itens.hits[1].author)
          .and('contain', itens.hits[1].num_comments)
          .and('contain', itens.hits[1].points)
        cy.get(`.table-row a:contains(${itens.hits[1].title})`)
          .should('have.attr', 'href', itens.hits[1].url)
      })

      it('Verifica ordenação por Comentarios', () => {
        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[0].title)
          .and('contain', itens.hits[0].author)
          .and('contain', itens.hits[0].num_comments)
          .and('contain', itens.hits[0].points)
        cy.get(`.table-row a:contains(${itens.hits[0].title})`)
          .should('have.attr', 'href', itens.hits[0].url)

        cy.contains('button', 'Comments').as('comentarios')
          .should('be.visible')
          .click()
        cy.get('.button-active')
          .should('be.visible')

        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[1].title)
          .and('contain', itens.hits[1].author)
          .and('contain', itens.hits[1].num_comments)
          .and('contain', itens.hits[1].points)
        cy.get(`.table-row a:contains(${itens.hits[1].title})`)
          .should('have.attr', 'href', itens.hits[1].url)
      })

      it('Verifica ordenação por Pontos', () => {
        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[0].title)
          .and('contain', itens.hits[0].author)
          .and('contain', itens.hits[0].num_comments)
          .and('contain', itens.hits[0].points)
        cy.get(`.table-row a:contains(${itens.hits[0].title})`)
          .should('have.attr', 'href', itens.hits[0].url)

        cy.contains('button', 'Points').as('pontos')
          .should('be.visible')
          .click()
        cy.get('.button-active')
          .should('be.visible')

        cy.get('@pontos')
          .click()

        cy.get('.table-row')
          .first()
          .should('contain', itens.hits[1].title)
          .and('contain', itens.hits[1].author)
          .and('contain', itens.hits[1].num_comments)
          .and('contain', itens.hits[1].points)
        cy.get(`.table-row a:contains(${itens.hits[1].title})`)
          .should('have.attr', 'href', itens.hits[1].url)
      })
    })

  })
})
