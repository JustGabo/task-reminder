import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
      <Stack.Screen options={{headerShown: false}} name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
