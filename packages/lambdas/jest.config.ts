export default {
  testEnvironment: "node",
  silent: true,
  transform: {
    "^.+\\.(ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          parser: { syntax: "typescript", decorators: false },
          target: "es2020",
        },
        module: { type: "commonjs" },
      },
    ],
  },
};
