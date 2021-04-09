const esModules = ['quasar/lang', 'lodash-es'].join('|');
module.exports = {
  globals: {
    __DEV__: true
  },
  // verbose: true,
  // watch: true,
  collectCoverage: false,
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura", "json-summary", "text-lcov"],
  coverageDirectory: '<rootDir>test/jest/coverage',
  collectCoverageFrom: [
    '<rootDir>/ui/src/components/**/*.(js|vue)'
  ],
  rootDir: "../",
  roots: [
    '<rootDir>/test',
    '<rootDir>/ui'
  ],
  // Needed in JS codebases too because of feature flags
  coveragePathIgnorePatterns: [
    'test/node_modules/',
    'ui/node_modules/',
    '.d.ts$'
  ],
  coverageThreshold: {
    global: {
      //  branches: 50,
      //  functions: 50,
      //  lines: 50,
      //  statements: 50
    },
  },
  testMatch: [
    '<rootDir>/test/jest/__tests__/**/*.(spec|test).js',
  ],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^vue$': '<rootDir>/test/node_modules/vue/dist/vue.common.js',
    '^quasar$': 'quasar/dist/quasar.common.js',
    '^@components/(.*)$': '<rootDir>/ui/src/components/$1'
  },
  transform: {
    "^.+\\.js$": "<rootDir>/test/node_modules/babel-jest",
    "^.+\\.vue$": "<rootDir>/test/node_modules/vue-jest",
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/test/node_modules/jest-transform-stub',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${esModules}))`
  ],
  snapshotSerializers: ['<rootDir>/test/node_modules/jest-serializer-vue'],
};
