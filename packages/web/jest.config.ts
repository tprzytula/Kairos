import type { Config } from 'jest'

const config: Config = {
  coverageDirectory: '.coverage',
  collectCoverage: true,
  verbose: true,
  setupFilesAfterEnv: ['./testSetup.ts'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
  }
}

export default config
