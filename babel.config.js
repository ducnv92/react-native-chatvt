const path = require("path");
module.exports = {
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  },
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": false }]
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      }
    ],
  ]
};
