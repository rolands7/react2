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