export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  silent: false,
  verbose: true,
  collectCoverageFrom: ['src/**'],
  coverageReporters: ['text'],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/(types|config).ts"
  ],
  coverageThreshold: {
    global: {
      lines: 85
    }
  },
};