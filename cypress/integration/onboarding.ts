describe('Onboarding', () => {
    beforeEach(async () => {
        cy.clearLocalStorage();

    });
    it('Complete Onboarding', () => {
        cy.visit('/');
        cy.contains('Bienvenue');

        cy.get('ion-button').contains('Passer').click();

        cy.get('#onboarding-start-beping').should('have.attr', 'disabled');
        cy.get('ion-checkbox').click();
        cy.get('#onboarding-start-beping').should('not.have.attr', 'disabled');
        cy.get('#onboarding-start-beping').click();

        cy.url().should('contain', 'tabs/homeTab/home');
    });

    it('Open CGU', () => {
        cy.visit('/');
        cy.contains('Bienvenue');

        cy.get('ion-button').contains('Passer').click();
        cy.get('#onboarding-cgu').click();
        cy.contains('Conditions');
        cy.contains('Dutch').click({force: true});
        cy.contains('English').click({force: true});
        cy.contains('Français').click({force: true});
        cy.get('#cgu-close').click();
        cy.get('#onboarding-privacy-policy').click();
        cy.contains('Politique');
        cy.contains('Dutch').click({force: true});
        cy.contains('English').click({force: true});
        cy.contains('Français').click({force: true});
        cy.get('#privacy-close').click();
        cy.get('ion-checkbox').click();
        cy.get('#onboarding-start-beping').click();

    });
});
