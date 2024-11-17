import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import { Loading } from '../components/common';

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return user.role === 'admin' ? <AdminNavigator /> : <UserNavigator />;
};

export default AppNavigator;