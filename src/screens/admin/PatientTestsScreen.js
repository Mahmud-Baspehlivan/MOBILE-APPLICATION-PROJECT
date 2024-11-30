import React, { useState, useEffect } from 'react';
import {
 View,
 Text,
 FlatList,
 StyleSheet,
 ActivityIndicator
} from 'react-native';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Picker } from '@react-native-picker/picker';

export default function PatientTestsScreen() {
 const [users, setUsers] = useState([]);
 const [selectedUser, setSelectedUser] = useState('');
 const [tests, setTests] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   fetchUsers();
 }, []);

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

 const renderTestItem = ({ item, index }) => {
   const testOrder = ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4'];
   const previousTest = tests[index + 1];

   const getChangeIndicator = (currentValue, previousValue) => {
     if (!previousValue) return null;
     if (currentValue > previousValue) return { icon: '↑', color: '#ff9500' };
     if (currentValue < previousValue) return { icon: '↓', color: '#ff3b30' };
     return { icon: '↔', color: '#34c759' };
   };

   return (
     <View style={styles.testCard}>
       <Text style={styles.dateText}>
         {item.date.toLocaleDateString('tr-TR')}
       </Text>
       
       {testOrder.map(key => {
         const currentValue = item.values[key];
         if (!currentValue) return null;
         
         const previousValue = previousTest?.values[key];
         const change = getChangeIndicator(currentValue, previousValue);
         
         return (
           <View key={key} style={styles.valueRow}>
             <Text style={styles.valueLabel}>{key}:</Text>
             <View style={styles.valueContainer}>
               <Text style={styles.valueText}>
                 {currentValue}
               </Text>
               {change && (
                 <Text style={[styles.changeIndicator, { color: change.color }]}>
                   {` ${change.icon}`}
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
 dateText: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 10,
   color: '#333',
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
   flexDirection: 'row',
   alignItems: 'center',
 },
 valueText: {
   fontSize: 16,
   fontWeight: '500',
   color: '#333',
 },
 changeIndicator: {
   fontSize: 16,
   marginLeft: 5,
   fontWeight: 'bold',
 },
 emptyText: {
   textAlign: 'center',
   fontSize: 16,
   color: '#666',
   marginTop: 20,
 }
});