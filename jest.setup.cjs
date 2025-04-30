// jest.setup.cjs
require('@testing-library/jest-dom');

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
}));