import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const UserManagement = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>User Management</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
  },
});

export default UserManagement;