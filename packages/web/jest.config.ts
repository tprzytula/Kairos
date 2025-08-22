import type { Config } from 'jest'

const config: Config = {
  coverageDirectory: '.coverage',
  collectCoverage: true,
  verbose: false,
  silent: true,
  setupFilesAfterEnv: ['./testSetup.ts'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '^url:(.*)$': '<rootDir>/__mocks__/url-mock.js',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-swipeable-list)/)"
  ],
}

export default config
