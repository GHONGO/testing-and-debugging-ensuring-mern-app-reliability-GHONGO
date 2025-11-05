import '@testing-library/jest-dom';

// Mock fetch if needed in future client tests
if (!global.fetch) {
  global.fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

