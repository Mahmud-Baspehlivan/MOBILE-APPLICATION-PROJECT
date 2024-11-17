import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Icon name="person-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user?.name || 'Not set'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="mail-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="shield-outline" size={20} color={COLORS.gray} />
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>{user?.role || 'User'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
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
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatarText: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
  },
  userName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  userEmail: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  section: {
    margin: SIZES.padding,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  infoLabel: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: SIZES.padding,
    width: 80,
  },
  infoValue: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.black,
    flex: 1,
    marginLeft: SIZES.padding,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  logoutText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
});

export default UserProfile;