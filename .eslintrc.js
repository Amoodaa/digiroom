module.exports = {
  extends: ["react-app"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@mui/*/*/*", "!@mui/material/test-utils/*"],
      },
    ],
  },
  overrides: [],
};
