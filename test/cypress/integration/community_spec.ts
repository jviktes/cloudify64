describe('Community version', () => {
    before(() => {
        cy.intercept('/console/auth/manager', { fixture: 'community/manager.json' });
        cy.intercept('/console/config', { fixture: 'community/config.json' });
        cy.intercept('GET', '/console/contactDetails', { contactDetailsReceived: true });
        cy.usePageMock().mockLoginWithoutWaiting({ isCommunity: true });
    });

    it('should have Community tag in the banner', () => {
        cy.get('.sidebar').contains('Community');
    });

    it('should have limited set of options in Users menu', () => {
        cy.contains('admin').click({ force: true });
        cy.contains('Edit Mode').should('be.visible');
        cy.contains('Reset Templates').should('be.visible');
        cy.contains('Change Password').should('be.visible');
        cy.contains('Logout').should('be.visible');

        cy.contains('License Management').should('not.exist');
        cy.contains('Template Management').should('not.exist');
    });

    it('should have community license in About modal', () => {
        cy.contains('Help').click({ force: true });
        cy.contains('About').click();
        cy.contains('a', 'End User License Agreement').should(
            'have.attr',
            'href',
            'https://cloudify.co/license-community/'
        );
    });

    it('should display contact details modal', () => {
        cy.intercept('GET', '/console/contactDetails', { contactDetailsReceived: false });
        cy.refreshTemplate();

        cy.contains('a', 'End User License Agreement').should(
            'have.attr',
            'href',
            'https://cloudify.co/license-community/'
        );

        cy.typeToFieldInput('First Name', 'Ja');
        cy.typeToFieldInput('Last Name', 'Ma');
        cy.typeToFieldInput('Email', 'a@o.pl');
        cy.typeToFieldInput('Phone number', '1234');
        cy.contains('By downloading Cloudify you agree to the terms').click();
        cy.contains('I agree to receive communications').click();

        cy.intercept('POST', '/console/contactDetails').as('contactDetailsSubmit');
        cy.clickButton('Continue');
        cy.wait('@contactDetailsSubmit').then(({ request }) => {
            expect(request.body).to.deep.equal({
                first_name: 'Ja',
                last_name: 'Ma',
                email: 'a@o.pl',
                phone: '1234',
                is_eula: true,
                is_send_services_details: true
            });
        });
    });
});
