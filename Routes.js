import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import Camera from './Camera'
import { Fields } from './LandmarkForm'

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Parallel" component={App}/>
            <Stack.Screen name="Camera" component={Camera}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;