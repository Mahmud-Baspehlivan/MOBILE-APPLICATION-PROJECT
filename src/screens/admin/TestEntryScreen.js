import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Picker } from '@react-native-picker/picker';

export default function TestEntryScreen() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [testValues, setTestValues] = useState({
    IgA: '',
    IgM: '',
    IgG: '',
    IgG1: '',
    IgG2: '',
    IgG3: '',
    IgG4: ''
  });
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcılar yüklenirken bir hata oluştu');
    }
  };

  const validateForm = () => {
    if (!selectedUser) {
      Alert.alert('Hata', 'Lütfen bir hasta seçin');
      return false;
    }

    // En az bir değerin girilmiş olması kontrolü
    const hasValue = Object.values(testValues).some(value => value !== '');
    if (!hasValue) {
      Alert.alert('Hata', 'Lütfen en az bir test değeri girin');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Sayısal değerlere dönüştür
      const numericValues = {};
      Object.entries(testValues).forEach(([key, value]) => {
        if (value !== '') {
          numericValues[key] = parseFloat(value);
        }
      });

      // Firestore'a kaydet
      await addDoc(collection(db, 'users', selectedUser, 'tests'), {
        date: new Date(date),
        values: numericValues,
        createdAt: new Date(),
        createdBy: 'admin',
      });

      Alert.alert('Başarılı', 'Tahlil değerleri kaydedildi');
      
      setTestValues({
        IgA: '',
        IgM: '',
        IgG: '',
        IgG1: '',
        IgG2: '',
        IgG3: '',
        IgG4: ''
      });
      setSelectedUser('');
    } catch (error) {
      Alert.alert('Hata', 'Tahlil değerleri kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Tahlil Değeri Girişi</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Hasta Seçin</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedUser}
              onValueChange={(itemValue) => setSelectedUser(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Hasta seçin" value="" />
              {users.map((user) => (
                <Picker.Item 
                  key={user.id} 
                  label={`${user.fullName} (${user.email})`} 
                  value={user.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        {Object.keys(testValues).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key}</Text>
            <TextInput
              style={styles.input}
              value={testValues[key]}
              onChangeText={(text) => setTestValues({ ...testValues, [key]: text })}
              keyboardType="decimal-pad"
              placeholder="Değer girin"
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 8,
  },
  picker: {
    height: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});