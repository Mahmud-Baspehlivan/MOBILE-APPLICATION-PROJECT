// src/screens/user/UserDashboard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = ({ navigation }) => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  button: {
    margin: SIZES.padding,
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
});

export default UserDashboard;