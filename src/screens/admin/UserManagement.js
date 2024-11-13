import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserManagement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default UserManagement;