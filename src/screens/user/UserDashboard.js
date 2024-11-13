import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = ({ navigation }) => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <Button 
        title="View Profile" 
        onPress={() => navigation.navigate('Profile')} 
      />
      <Button 
        title="Logout" 
        onPress={logout}
        type="secondary" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default UserDashboard;