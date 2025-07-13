// jest.config.mjs
export default {
  testEnvironment: 'node',
  transform: {}, // no babel
  testMatch: ['**/tests/**/*.test.mjs'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
