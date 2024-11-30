import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { calculateAgeAtDate, getAgeGroup } from "../../utils/ageCalculations";

export default function TestHistoryScreen() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);

  useEffect(() => {
    fetchReferenceValues();
    fetchTests();
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

  const fetchTests = async () => {
    try {
      const testsRef = collection(db, "users", user.uid, "tests");
      const querySnapshot = await getDocs(testsRef);

      const testsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));

      setTests(testsData);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTestStatus = (value, testType, testDate) => {
    if (!referenceValues || !user.birthDate) return null;

    const ageGroup = getAgeGroup(user.birthDate, testDate, testType);
    const reference = referenceValues[testType]?.[ageGroup];

    if (!reference) return null;

    if (value < (reference?.min / 100).toFixed(3)) {
      return { status: "low", icon: "↓", color: "#ff3b30" };
    }
    if (value > (reference?.max / 100).toFixed(3)) {
      return { status: "high", icon: "↑", color: "#ff9500" };
    }
    return { status: "normal", icon: "↔", color: "#34c759" };
  };

  const renderTestItem = ({ item }) => {
    const age = calculateAgeAtDate(user.birthDate, item.date);
    const testOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];
    const ageText =
      age.years > 0
        ? `${age.years} yaş`
        : age.months > 0
        ? `${age.months} ay`
        : `${age.days} gün`;

    return (
      <View style={styles.testCard}>
        <View style={styles.testHeader}>
          <Text style={styles.dateText}>
            {item.date.toLocaleDateString("tr-TR")}
          </Text>
          <Text style={styles.ageText}>Test tarihindeki yaş: {ageText}</Text>
        </View>

        <View style={styles.valuesContainer}>
          {testOrder.map((key) => {
            const value = item.values[key];
            if (!value) return null;

            const status = getTestStatus(value, key, item.date);
            if (!status) return null;

            const reference =
              referenceValues[key]?.[
                getAgeGroup(user.birthDate, item.date, key)
              ];

            return (
              <View key={key} style={styles.valueRow}>
                <Text style={styles.valueLabel}>{key}:</Text>
                <View style={styles.valueContainer}>
                  <Text style={[styles.valueText, { color: status.color }]}>
                    {value} {status.icon}
                  </Text>
                  <Text style={styles.referenceText}>
                    Referans: {(reference?.min / 100).toFixed(2)} -{" "}
                    {(reference?.max / 100).toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tahlil bulunamadı</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  testCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  valuesContainer: {
    marginTop: 5,
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  valueLabel: {
    fontSize: 16,
    color: "#666",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  testHeader: {
    flexDirection: "column",
    marginBottom: 10,
  },
  ageText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  referenceText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
