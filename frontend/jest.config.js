/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  // ngx-markdown ships ESM only (.mjs); transform it (and other ESM deps) so Jest (CJS) can load it.
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
