import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = searchQuery
        ? query(usersRef, where('fullName', '>=', searchQuery), where('fullName', '<=', searchQuery + '\uf8ff'))
        : usersRef;
      
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleUpdateUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    Alert.alert(
      'Rol Değiştir',
      `Kullanıcı rolünü ${newRole} olarak değiştirmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const userRef = doc(db, 'users', userId);
              await updateDoc(userRef, {
                role: newRole,
                updatedAt: new Date()
              });
              
              setUsers(users.map(user => 
                user.id === userId 
                  ? {...user, role: newRole}
                  : user
              ));
              
              Alert.alert('Başarılı', 'Kullanıcı rolü güncellendi');
            } catch (error) {
              Alert.alert('Hata', 'Rol güncellenirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const handleUpdateUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    
    Alert.alert(
      'Durum Değiştir',
      `Kullanıcı durumunu ${newStatus === 'active' ? 'aktif' : 'engelli'} olarak değiştirmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              const userRef = doc(db, 'users', userId);
              await updateDoc(userRef, {
                status: newStatus,
                updatedAt: new Date()
              });
              
              setUsers(users.map(user => 
                user.id === userId 
                  ? {...user, status: newStatus}
                  : user
              ));
              
              Alert.alert('Başarılı', 'Kullanıcı durumu güncellendi');
            } catch (error) {
              Alert.alert('Hata', 'Durum güncellenirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userDetail}>Rol: {item.role}</Text>
        <Text style={styles.userDetail}>Durum: {item.status}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.role === 'admin' ? '#ff3b30' : '#34c759' }]}
          onPress={() => handleUpdateUserRole(item.id, item.role)}
        >
          <Text style={styles.actionButtonText}>
            {item.role === 'admin' ? 'User Yap' : 'Admin Yap'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.status === 'active' ? '#ff9500' : '#34c759' }]}
          onPress={() => handleUpdateUserStatus(item.id, item.status)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Engelle' : 'Aktif Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Kullanıcı Ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Kullanıcı bulunamadı</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      padding: 10,
      backgroundColor: '#fff',
    },
    searchInput: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 8,
      fontSize: 16,
    },
    listContainer: {
      padding: 10,
    },
    userCard: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    userInfo: {
      marginBottom: 10,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    userEmail: {
      fontSize: 16,
      color: '#666',
      marginBottom: 5,
    },
    userDetail: {
      fontSize: 14,
      color: '#888',
      marginBottom: 2,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    actionButton: {
      padding: 8,
      borderRadius: 6,
      flex: 0.48, // Yaklaşık yarım genişlik
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#666',
      marginTop: 20,
    },
    roleText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#fff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      overflow: 'hidden',
    },
    adminRole: {
      backgroundColor: '#007AFF',
    },
    userRole: {
      backgroundColor: '#34C759',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusActive: {
      backgroundColor: '#34C759',
    },
    statusBlocked: {
      backgroundColor: '#FF3B30',
    },
    lastLoginText: {
      fontSize: 12,
      color: '#999',
      marginTop: 5,
    }
  });