/**
 * @format
 */

import {AppRegistry, Text, TextInput } from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

if (__DEV__) {
    import('./reactotronConfig').then(() => console.log('Reactotron Configured'));
  }

AppRegistry.registerComponent(appName, () => App);

Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
