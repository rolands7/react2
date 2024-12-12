import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
//import Button from './components/atom/Button';
import Instana from '@instana/react-native-agent';


// Generar un hash simple usando la suma de los valores Unicode
const generateSimpleHash = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;  // Convertir a entero de 32 bits
  }
  return Math.abs(hash).toString();  // Evitar valores negativos
};


export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



  Instana.setView('LoginView');


  const handleLogin = async () => {

    var options = {}
    options.enableCrashReporting = true;
    Instana.setup('WfqrTtU2RN-wvxYQp4VOJA', 'https://eum-red-saas.instana.io/mobile', options);
    Instana.setIgnoreURLsByRegex([
      'http://localhost:8081.*',       // Ignora todas las rutas de usuarios
      'http://localhost:8097.*',    // Ignora rutas que terminan con IDs numéricos
    ]);

    Instana.setView('LoginView');
  // Variables de tiempo
  const startTime = performance.now(); // Inicio de la ejecución de la función

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Credenciales inválidas');

        const endTime = performance.now(); // Fin de la ejecución de la función
        const duration = endTime - startTime; // Duración en milisegundos
          // Log del tiempo de duración
        console.log(`Tiempo de duración de la operación de autenticacion fallida: ${duration.toFixed(2)} ms`);
      
        Instana.reportEvent('Autenticacion fallida', {
          duration: duration,
          viewName: 'LoginView',
          meta: {
            duration: String(duration),
            viewName: 'LoginView'
          },
        });
        return;
      }

      const endTime = performance.now(); // Fin de la ejecución de la función
      const duration = endTime - startTime; // Duración en milisegundos
        // Log del tiempo de duración
      console.log(`Tiempo de duración de la operación de autenticacion exitosa: ${duration.toFixed(2)} ms`);
    
      Instana.reportEvent('Autenticacion exitosa', {
        duration: duration,
        viewName: 'LoginView',
        meta: {
          duration: String(duration),
          viewName: 'LoginView'
        },
      });

      // Generar hash del username y configurarlo en Instana
      const userIDHash = generateSimpleHash(username);
      Instana.setUserID(userIDHash);
      Instana.setUserName(username);
      Instana.setMeta('randomKey', 'randomValue');
      
      const data = await response.json();
      Alert.alert('Éxito', 'Inicio de sesión correcto');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error, intenta más tarde');


    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
//        keyboardType="default"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin}   />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
