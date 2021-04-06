const esModules = ['quasar/lang', 'lodash-es'].join('|');
module.exports = {
  globals: {
    __DEV__: true
  },
  // verbose: true,
  // watch: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/jest/coverage',
  collectCoverageFrom: [
    '<rootDir>../ui/src/components/*.vue'
  ],
  // Needed in JS codebases too because of feature flags
  coveragePathIgnorePatterns: ['/node_modules/', '.d.ts$'],
  coverageThreshold: {
    global: {
      //  branches: 50,
      //  functions: 50,
      //  lines: 50,
      //  statements: 50
    },
  },
  testMatch: [
    '<rootDir>/jest/__tests__/**/*.(spec|test).js',
  ],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^test-utils$': '@vue/test-utils/dist/vue-test-utils.js',
    '^quasar$': 'quasar/dist/quasar.common.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>../ui/src/components/$1',
    '.*css$': '@quasar/quasar-app-extension-testing-unit-jest/stub.css',
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest",
    '<rootDir>../ui/src/components/$1': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${esModules}))`
  ],
  snapshotSerializers: ['jest-serializer-vue'],
};
