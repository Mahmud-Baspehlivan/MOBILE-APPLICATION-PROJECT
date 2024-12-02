import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// User Screens
import HomeScreen from "../screens/user/HomeScreen";
import UserProfileScreen from "../screens/user/UserProfileScreen";
import TestHistoryScreen from "../screens/user/TestHistoryScreen";

// Admin Screens
import AdminUserScreen from "../screens/admin/AdminUserScreen";
import ReferenceValuesUploadScreen from "../screens/admin/ReferenceValuesUploadScreen";
import TestEntryScreen from "../screens/admin/TestEntryScreen";
import PatientTestsScreen from "../screens/admin/PatientTestsScreen";

import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Tests"
        component={TestHistoryScreen}
        options={{
          title: "Tahlillerim",
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-text" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AdminHome"
        component={HomeScreen}
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ReferenceValues"
        component={ReferenceValuesUploadScreen}
        options={{
          title: "Referans Değerler",
          tabBarIcon: ({ color, size }) => (
            <Icon name="test-tube" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TestEntry"
        component={TestEntryScreen}
        options={{
          title: "Tahlil Girişi",
          tabBarIcon: ({ color, size }) => (
            <Icon name="edit" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminUserScreen}
        options={{
          title: "Kullanıcılar",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PatientTests"
        component={PatientTestsScreen}
        options={{ title: "Hasta Tahlilleri" }}
      />
      <Tab.Screen
        name="Users"
        component={UserProfileScreen}
        options={{
          title: "Hastalar",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-o" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, userRole } = useAuth();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return userRole === "admin" ? <AdminTabs /> : <UserTabs />;
}
