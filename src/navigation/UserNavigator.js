// src/navigation/UserNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../constants/theme';

// Ekranları doğru şekilde import edelim
import UserDashboard from '../screens/user/UserDashboard';
import UserProfile from '../screens/user/UserProfile';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.black,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="UserDashboard" 
        component={UserDashboard}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={UserProfile}
        options={{
          title: 'My Profile',
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;