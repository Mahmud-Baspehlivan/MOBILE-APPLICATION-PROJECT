import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ReferenceValuesUploadScreen() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      await setDoc(doc(db, 'settings', 'referenceValues'), {
        values: sampleReferenceValues,
        updatedAt: new Date()
      });
      Alert.alert('Başarılı', 'Referans değerleri yüklendi');
    } catch (error) {
      Alert.alert('Hata', 'Referans değerleri yüklenirken bir hata oluştu');
      console.error(error);
    }
  };

  const sampleReferenceValues = {
    IgA: {
        '0-30 days': { min: 6.67, max: 8.75 },
        '1-3 months': { min: 6.67, max: 24.6 },
        '4-6 months': { min: 6.67, max: 53 },
        '7-12 months': { min: 6.68, max: 114 },
        '13-24 months': { min: 13.1, max: 103 },
        '25-36 months': { min: 6.67, max: 135 },
        '3-5 years': { min: 35.7, max: 192 },
        '6-8 years': { min: 44.8, max: 276 },
        '9-11 years': { min: 32.6, max: 262 },
        '12-16 years': { min: 36.4, max: 305 },
        '17-18 years': { min: 46.3, max: 385 },
        'Older than 18 years': { min: 6.67, max: 385 },
        },
      IgM: {
        '0-30 days': { min: 5.1, max: 50.9 },
        '1-3 months': { min: 15.2, max: 68.5 },
        '4-6 months': { min: 26.9, max: 130 },
        '7-12 months': { min: 24.2, max: 162 },
        '13-24 months': { min: 38.6, max: 195 },
        '25-36 months': { min: 42.7, max: 236 },
        '3-5 years': { min: 58.7, max: 198 },
        '6-8 years': { min: 50.3, max: 242 },
        '9-11 years': { min: 37.4, max: 213 },
        '12-16 years': { min: 42.4, max: 197 },
        '17-18 years': { min: 60.7, max: 323 },
        'Older than 18 years': { min: 5.1, max: 323 },
        },
    IgG: {
        '0-30 days': { min: 399, max: 1480 },
        '1-3 months': { min: 217, max: 981 },
        '4-6 months': { min: 270, max: 1110 },
        '7-12 months': { min: 242, max: 977 },
        '13-24 months': { min: 389, max: 1260 },
        '25-36 months': { min: 486, max: 1970 },
        '3-5 years': { min: 457, max: 1120 },
        '6-8 years': { min: 483, max: 1580 },
        '9-11 years': { min: 642, max: 2290 },
        '12-16 years': { min: 636, max: 1610 },
        '17-18 years': { min: 688, max: 2430 },
        'Older than 18 years': { min: 217, max: 2430 },
        },
    IgG1: {
        '25-36 months': { min: 309, max: 1450 },
        '3-5 years': { min: 273, max: 679 },
        '6-8 years': { min: 292, max: 781 },
        '9-11 years': { min: 410, max: 153 },
        '12-16 years': { min: 344, max: 958 },
        '17-18 years': { min: 403, max: 1520 },
        'Older than 18 years': { min: 273, max: 1530 },
        },
    IgG2: {
        '25-36 months': { min: 87.6, max: 289 },
        '3-5 years': { min: 73.3, max: 271 },
        '6-8 years': { min: 88.1, max: 408 },
        '9-11 years': { min: 81, max: 442 },
        '12-16 years': { min: 159, max: 406 },
        '17-18 years': { min: 184, max: 696 },
        'Older than 18 years': { min: 73.3, max: 696 },
        },
    IgG3: {
        '25-36 months': { min: 19.8, max: 75 },
        '3-5 years': { min: 20.8, max: 93.2 },
        '6-8 years': { min: 18.9, max: 135 },
        '9-11 years': { min: 34.1, max: 200 },
        '12-16 years': { min: 35.2, max: 150 },
        '17-18 years': { min: 29.3, max: 200 },
        'Older than 18 years': { min: 18.9, max: 200 },
        },
    IgG4: {
        '25-36 months': { min: 7.86, max: 57.2 },
        '3-5 years': { min: 7.86, max: 122 },
        '6-8 years': { min: 7.86, max: 157 },
        '9-11 years': { min: 7.86, max: 93.8 },
        '12-16 years': { min: 7.86, max: 119 },
        '17-18 years': { min: 7.86, max: 157 },
        'Older than 18 years': { min: 7.86, max: 157 },
        },    
    };

  const uploadReferenceValues = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'referenceValues'), {
        values: sampleReferenceValues,
        updatedAt: new Date()
      });
      
      Alert.alert(
        'Başarılı',
        'Referans değerleri başarıyla yüklendi',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.error('Error uploading reference values:', error);
      Alert.alert(
        'Hata',
        'Referans değerleri yüklenirken bir hata oluştu',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Referans Değerleri Yönetimi</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Bu ekran, tüm test tipleri için yaş gruplarına göre referans değerlerini 
          Firestore veritabanına yüklemek için kullanılır.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.buttonDisabled]}
        onPress={uploadReferenceValues}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Yükleniyor...' : 'Referans Değerlerini Yükle'}
        </Text>
      </TouchableOpacity> */}

      <View style={styles.previewContainer}>
        {/* <Text style={styles.previewTitle}>Yüklenecek Değerler:</Text> */}
        {Object.entries(sampleReferenceValues).map(([testType, ageRanges]) => (
          <View key={testType} style={styles.testTypeContainer}>
            <Text style={styles.testTypeTitle}>{testType}</Text>
            {Object.entries(ageRanges).map(([ageRange, values]) => (
            <Text key={ageRange} style={styles.rangeText}>
              {ageRange}: Min: {(values.min/100).toFixed(4)}, Max: {(values.max/100).toFixed(4)}
            </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testTypeContainer: {
    marginBottom: 16,
  },
  testTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,

  }
});