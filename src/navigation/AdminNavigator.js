import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import { COLORS } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const AdminNavigator = () => {
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
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{
          title: 'Admin Dashboard',
          headerRight: () => (
            <Icon 
              name="notifications-outline" 
              size={24} 
              color={COLORS.black}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagement}
        options={{
          title: 'User Management',
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;