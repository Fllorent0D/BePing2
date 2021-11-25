describe('HomeScreen', () => {
    describe('Select main player', () => {
        beforeEach(async () => {
            cy.clearLocalStorage();
            await new Promise<void>((resolve) => {
                cy.fixture('state/no-main-player.json').then((state) => {
                    window.localStorage.setItem('CapacitorStorage.@@STATE', JSON.stringify(JSON.stringify(state)));
                    resolve();
                });
            });

        });
        it('should select a main player', () => {
            cy.visit('/tabs/homeTab/home');
            cy.get('ion-button').contains('Sélectionner').click();
            cy.get('beping-choose-main-member-club ion-item').eq(0).click({force: true}).wait(1000);
            cy.get('beping-choose-club #search-club input').wait(500).eq(0).type('N051', {force: true}).wait(500);
            cy.get('beping-choose-club ion-item').eq(0).click();
            cy.get('beping-choose-main-member-club ion-item').eq(1).wait(1000).click({force: true});
            cy.get('beping-choose-player ion-virtual-scroll ion-label').contains('Cecile Ozer').click({force: true});
            cy.get('beping-choose-main-member-club ion-item').contains('Appliquer').click();
            cy.contains('Cecile Ozer');
        });
    });

    describe('login to tabt', () => {
        beforeEach(async () => {
            cy.clearLocalStorage();
            await new Promise<void>((resolve) => {
                cy.fixture('state/one-member-entry.json').then((state) => {
                    window.localStorage.setItem('CapacitorStorage.@@STATE', JSON.stringify(JSON.stringify(state)));
                    resolve();
                });
            });

        });
        it('should login to tabt', () => {
            cy.intercept({method: 'GET', url: '/v1/health/test'}, {fixture: 'tabt/health-logged.json'}).as('login');

            cy.visit('/tabs/homeTab/home');
            cy.get('ion-button').contains('Se connecter').click().wait(1000);
            cy.get('beping-aftt-login input').eq(0).click().type('floca');
            cy.get('beping-aftt-login input').eq(1).click().type('test');
            cy.get('beping-aftt-login ion-item').contains('Se connecter').click();

            cy.wait(['@login']);
            cy.contains('arrivera sous peu');
            cy.get('beping-aftt-login').should('not.exist');
            cy.get('ion-button').contains('Se connecter').should('not.exist');


        });

        it('should display an error message to tabt', () => {
            cy.intercept({method: 'GET', url: '/v1/health/test'}, {fixture: 'tabt/health-not-logged.json'}).as('login');

            cy.visit('/tabs/homeTab/home');
            cy.get('ion-button').contains('Se connecter').click().wait(1000);
            cy.get('beping-aftt-login input').eq(0).click().type('floca');
            cy.get('beping-aftt-login input').eq(1).click().type('test');
            cy.get('beping-aftt-login ion-item').contains('Se connecter').click();

            cy.wait(['@login']);
            cy.contains('Login invalide');
            cy.get('beping-aftt-login').should('exist');

        });
    });


});
