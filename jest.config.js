/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'], // Ensure Jest can find modules in src
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // If using path aliases
  },
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'], // Ensure coverage includes src files
  rootDir: './', // Set root directory explicitly
};
