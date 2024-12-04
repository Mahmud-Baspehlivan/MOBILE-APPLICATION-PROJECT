import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Picker } from '@react-native-picker/picker';
import { calculateAgeAtDate, getAgeGroup } from '../../utils/ageCalculations';

export default function PatientTestsScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchReferenceValues();
  }, []);

  const fetchReferenceValues = async () => {
    try {
      const docRef = doc(db, "settings", "referenceValues");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReferenceValues(docSnap.data().values);
      }
    } catch (error) {
      console.error("Error fetching reference values:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async (userId) => {
    setLoading(true);
    try {
      // Fetch user data first
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setSelectedUserData(userDoc.data());
      }

      const testsRef = collection(db, 'users', userId, 'tests');
      const q = query(testsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      setTests(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      })));
    } finally {
      setLoading(false);
    }
  };

  const getTestStatus = (value, testType, testDate) => {
    if (!referenceValues || !selectedUserData?.birthDate) return null;

    const ageGroup = getAgeGroup(selectedUserData.birthDate, testDate, testType);
    const reference = referenceValues[testType]?.[ageGroup];

    if (!reference) return null;

    if (value < (reference?.min / 100).toFixed(3)) {
      return { status: 'low', icon: '↓', color: '#ff3b30' };
    }
    if (value > (reference?.max / 100).toFixed(3)) {
      return { status: 'high', icon: '↑', color: '#ff9500' };
    }
    return { status: 'normal', icon: '↔', color: '#34c759' };
  };

  const renderTestItem = ({ item, index }) => {
    const testOrder = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];
    const previousTest = tests[index + 1];

    let age;
    if (selectedUserData?.birthDate) {
      age = calculateAgeAtDate(selectedUserData.birthDate, item.date);
    }

    const ageText = age
      ? age.years > 0
        ? `${age.years} yaş`
        : age.months > 0
        ? `${age.months} ay`
        : `${age.days} gün`
      : null;

    return (
      <View style={styles.testCard}>
        <View style={styles.testHeader}>
          <Text style={styles.dateText}>
            {item.date.toLocaleDateString('tr-TR')}
          </Text>
          {ageText && (
            <Text style={styles.ageText}>
              Test tarihindeki yaş: {ageText}
            </Text>
          )}
        </View>

        {testOrder.map(key => {
          const currentValue = item.values[key];
          if (!currentValue) return null;

          const status = getTestStatus(currentValue, key, item.date);
          if (!status) return null;

          const reference = referenceValues[key]?.[
            getAgeGroup(selectedUserData?.birthDate, item.date, key)
          ];

          return (
            <View key={key} style={styles.valueRow}>
              <Text style={styles.valueLabel}>{key}:</Text>
              <View style={styles.valueContainer}>
                <Text style={[styles.valueText, { color: status.color }]}>
                  {currentValue} {status.icon}
                </Text>
                {reference && (
                  <Text style={styles.referenceText}>
                    Referans: {(reference?.min / 100).toFixed(2)} - {(reference?.max / 100).toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedUser}
          onValueChange={(itemValue) => {
            setSelectedUser(itemValue);
            if (itemValue) fetchTests(itemValue);
          }}
        >
          <Picker.Item label="Hasta seçin" value="" />
          {users.map(user => (
            <Picker.Item 
              key={user.id} 
              label={`${user.fullName} (${user.email})`}
              value={user.id} 
            />
          ))}
        </Picker>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {selectedUser ? 'Tahlil bulunamadı' : 'Lütfen bir hasta seçin'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  testCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testHeader: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  ageText: {
    fontSize: 14,
    color: '#666',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  valueLabel: {
    fontSize: 16,
    color: '#666',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  referenceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  }
});