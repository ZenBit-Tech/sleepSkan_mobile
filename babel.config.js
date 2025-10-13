module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        // path: '.env',
        blocklist: null,
        allowlist: null,
        safe: true,
        allowUndefined: false,
      },
      'react-native-worklets/plugin',
    ],
    [
      'module-resolver',
      {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
          src: './src',
        },
      },
    ],
  ],
};
