import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboard from '../screens/user/UserDashboard';
import UserProfile from '../screens/user/UserProfile';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={UserDashboard} />
      <Stack.Screen name="Profile" component={UserProfile} />
    </Stack.Navigator>
  );
};

export default UserNavigator;