const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // [
    //   'react-native-reanimated/plugin',
    // ],
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: path.join(__dirname, '..', pak.source),
        },
      },
    ],

  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
