import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Icon name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const AdminDashboard = ({ navigation }) => {
  const { user, logout } = useAuth();

  const stats = [
    { title: 'Total Users', value: '256', icon: 'people', color: COLORS.primary },
    { title: 'Active Users', value: '180', icon: 'person', color: COLORS.success },
    { title: 'New Users', value: '24', icon: 'person-add', color: COLORS.secondary },
    { title: 'Reports', value: '5', icon: 'warning', color: COLORS.error }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Icon name="log-out-outline" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Icon name="people" size={24} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  welcomeText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  adminName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
  },
  logoutButton: {
    padding: SIZES.base,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.padding,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    borderLeftWidth: 4,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statTitle: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
    marginVertical: SIZES.base,
  },
  actionsContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  actionButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.black,
    marginLeft: SIZES.padding,
  },
});

export default AdminDashboard;