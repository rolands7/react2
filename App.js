// App.js
import {StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './store';
import {Provider} from 'react-redux';

import Login from './src/Login';
import Home from './src/Home';
import Instana from '@instana/react-native-agent';

const Stack = createNativeStackNavigator();

export default function App() {

  var options = {}

  options.enableCrashReporting = true;
  Instana.setup('kC6DlN6kSfCadu9dx_SvpA', 'https://eum-coral-saas.instana.io/mobile', options);


 /* Instana.setIgnoreURLsByRegex([
    'http://localhost:8081.*',       // Ignora todas las rutas de usuarios
    'http://localhost:8097.*',    // Ignora rutas que terminan con IDs numéricos
  ]);
*/

  Instana.setIgnoreURLsByRegex([
    'http://localhost:8081.*',       // Ignora todas las rutas de usuarios
    'http://localhost:8097.*',    // Ignora rutas que terminan con IDs numéricos
  ]);


  return (
    <Provider store={store}>  {/* Asegúrate de envolver tu aplicación en el Provider */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}