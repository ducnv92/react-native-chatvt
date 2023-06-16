const path = require("path");
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
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
