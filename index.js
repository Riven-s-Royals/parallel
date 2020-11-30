import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';

import App from './App';
import Routes from './Routes'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Routes);
