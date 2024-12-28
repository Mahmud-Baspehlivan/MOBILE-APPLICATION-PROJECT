import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { calculateAgeAtDate, getAgeGroup } from "../../utils/ageCalculations";

// Main screen component for displaying user's test history
export default function TestHistoryScreen() {
  // State management
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchReferenceValues();
    fetchTests();
  }, []);

  // Fetch reference values from Firestore
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

  // Fetch user's test history from Firestore
  const fetchTests = async () => {
    try {
      const testsRef = collection(db, "users", user.uid, "tests");
      const querySnapshot = await getDocs(testsRef);

      const testsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));

      const sortedTestsData = testsData.sort((a, b) => b.date - a.date);

      setTests(sortedTestsData);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render individual test item in the list
  const renderTestItem = ({ item }) => {
    const age = calculateAgeAtDate(user.birthDate, item.date);
    const ageText =
      age.years > 0
        ? `${age.years} yaş`
        : age.months > 0
        ? `${age.months} ay`
        : `${age.days} gün`;

    return (
      <TouchableOpacity
        style={styles.testCard}
        onPress={() => setSelectedTest(item)}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>{item.date.getDate()}</Text>
          <Text style={styles.dateMonth}>
            {item.date.toLocaleString("tr-TR", { month: "short" })}
          </Text>
          <Text style={styles.dateYear}>{item.date.getFullYear()}</Text>
        </View>
        <View style={styles.testInfo}>
          <Text style={styles.ageText}>Test tarihindeki yaş: {ageText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render detailed view of a selected test
  const renderTestDetails = () => {
    if (!selectedTest) return null;

    const age = calculateAgeAtDate(user.birthDate, selectedTest.date);
    let ageText;
    if (age.years < 3) {
      const totalMonths = age.years * 12 + age.months;
      ageText = `${totalMonths} ay`;
    } else {
      ageText = `${age.years} yaş`;
    }

    // Test types in display order
    const testOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

    return (
      <View style={styles.testDetailsContainer}>
        <View style={styles.detailsHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedTest(null)}
            >
              <Text style={styles.backButtonIcon}>←</Text>
              <Text style={styles.backButtonText}>Geri</Text>
            </TouchableOpacity>

            <Text style={styles.detailHeaderDate}>
              {selectedTest.date.toLocaleDateString("tr-TR")}
            </Text>
          </View>
          <View style={styles.ageContainer}>
            <Text style={styles.ageText}>Test tarihindeki yaş: {ageText}</Text>
          </View>
        </View>

        <FlatList
          data={testOrder}
          keyExtractor={(item) => item}
          renderItem={({ item: key }) => {
            const value = selectedTest.values[key];
            if (!value || !referenceValues) return null;

            // Get trend info
            const currentIndex = tests.findIndex(
              (test) => test.id === selectedTest.id
            );
            const previousTest = tests[currentIndex + 1];
            const previousValue = previousTest?.values[key];

            let trend = null;
            if (previousValue !== undefined) {
              if (value > previousValue) trend = "Artmış";
              else if (value < previousValue) trend = "Azalmış";
              else trend = "Değişmemiş";
            }

            // Get reference values and status
            const ageGroup = getAgeGroup(
              user.birthDate,
              selectedTest.date,
              key
            );
            let statusIcon = "↔";
            let statusColor = "#34c759";

            // Find reference values from any article that contains this test type
            for (const article of Object.values(referenceValues)) {
              if (article.values[key]?.[ageGroup]) {
                const reference = article.values[key][ageGroup];
                if (value < reference.min) {
                  statusIcon = "↓";
                  statusColor = "#ff3b30";
                } else if (value > reference.max) {
                  statusIcon = "↑";
                  statusColor = "#ff9500";
                }
                break;
              }
            }

            return (
              <View style={styles.testSection}>
                <View style={styles.testTitleContainer}>
                  <Text style={styles.testTitle}>{key}</Text>
                  <View style={styles.valueWrapper}>
                    {trend && <Text style={styles.trendText}>{trend}</Text>}
                    <Text style={styles.testValue}>{value}</Text>
                    <Text style={[styles.statusIcon, { color: statusColor }]}>
                      {statusIcon}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      {selectedTest ? (
        renderTestDetails()
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tahlil bulunamadı</Text>
          }
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // Basic container styles
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
  },

  // Test card styles
  testCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  testInfo: {
    flex: 1,
  },

  // Date display styles
  dateContainer: {
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  dateDay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  dateMonth: {
    fontSize: 16,
    color: "#666",
  },
  dateYear: {
    fontSize: 14,
    color: "#666",
  },

  // Test details styles
  detailsHeader: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonIcon: {
    fontSize: 24,
    color: "#007AFF",
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  detailHeaderDate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // Test results display styles
  testSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  testValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  valueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Age display styles
  ageContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  ageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  // Status indicators
  statusIcon: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  trendText: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 5,
  },

  // Empty state message
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },

  // Container for test details view
  testDetailsContainer: {
    flex: 1,
  }
});
