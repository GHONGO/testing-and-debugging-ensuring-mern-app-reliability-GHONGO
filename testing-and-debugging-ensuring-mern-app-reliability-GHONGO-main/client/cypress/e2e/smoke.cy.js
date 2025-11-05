describe('Smoke E2E', () => {
  it('runs a basic assertion', () => {
    expect(true).to.eq(true);
  });

  // If the dev server is running, this will check the landing page
  it('visits home when server is running', () => {
    cy.visit('/');
    // This will pass if the page loads and contains the app title
    cy.contains('MERN Testing App');
  });
});

