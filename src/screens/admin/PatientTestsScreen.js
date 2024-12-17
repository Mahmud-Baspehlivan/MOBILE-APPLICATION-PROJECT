import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Picker } from "@react-native-picker/picker";
import { calculateAgeAtDate, getAgeGroup } from "../../utils/ageCalculations";

export default function PatientTestsScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isSearchActive, setIsSearchActive] = useState(false);

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
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(
        usersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async (userId) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setSelectedUserData(userDoc.data());
      }

      const testsRef = collection(db, "users", userId, "tests");
      const q = query(testsRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      setTests(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusForValue = (value, reference, type) => {
    const status = {
      low: { status: "low", icon: "↓", color: "#ff3b30" },
      high: { status: "high", icon: "↑", color: "#ff9500" },
      normal: { status: "normal", icon: "↔", color: "#34c759" },
    };
  
    switch (type) {
      case 'geoMean':
        const geoMeanMin = reference.geoMean.value - reference.geoMean.sd;
        const geoMeanMax = reference.geoMean.value + reference.geoMean.sd;
        return status[
          value < geoMeanMin
            ? "low"
            : value > geoMeanMax
            ? "high"
            : "normal"
        ];

        case 'mean':
          const meanMin = reference.mean.value - reference.mean.sd;
          const meanMax = reference.mean.value + reference.mean.sd;
          return status[
            value < meanMin
              ? "low"
              : value > meanMax
              ? "high"
              : "normal"
          ]; 
      
      case 'confidence':
        return status[
          value < reference.confidenceInterval[0]
            ? "low"
            : value > reference.confidenceInterval[1]
            ? "high"
            : "normal"
        ];
      
      default: // min-max için
        return status[
          value < reference.min
            ? "low"
            : value > reference.max
            ? "high"
            : "normal"
        ];
    }
  };

  const getTestStatusForAllArticles = (value, testType, testDate) => {
    if (!referenceValues || !selectedUserData?.birthDate) return null;
  
    const results = [];
    for (const [articleId, article] of Object.entries(referenceValues)) {
      if (article.values[testType]) {
        const ageGroup = getAgeGroup(
          selectedUserData.birthDate,
          testDate,
          testType,
          article.name
        );
        const reference = article.values[testType]?.[ageGroup];
  
        if (reference) {
          // min-max için status
          const minMaxStatus = getStatusForValue(value, reference, 'minMax');
          // geoMean için status
          const geoMeanStatus = reference.geoMean 
            ? getStatusForValue(value, reference, 'geoMean')
            : null;
          // mean için status
          const meanStatus = reference.geoMean 
            ? getStatusForValue(value, reference, 'geoMean')
            : null;  
          // confidence için status
          const confidenceStatus = reference.confidenceInterval 
            ? getStatusForValue(value, reference, 'confidence')
            : null;
  
          results.push({
            articleName: article.name,
            reference,
            status: minMaxStatus,
            geoMeanStatus,
            meanStatus,
            confidenceStatus,
            ageGroup,
          });
        }
      }
    }
    return results;
  };

  const renderTestItem = ({ item }) => {
    const age = calculateAgeAtDate(selectedUserData.birthDate, item.date);
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

  const renderReferenceDetails = (articleResult) => {
    const { reference, status, geoMeanStatus, meanStatus, confidenceStatus } = articleResult;
  
    return (
      <View style={styles.articleResult}>
        {reference.min && (
          <View style={styles.statusRow}>
            <Text style={[styles.statusIcon, { color: status.color }]}>
              {status.icon}
            </Text>
            <Text style={styles.statLabel}>Min Max:</Text>
            <Text style={styles.statValue}>
              {reference.min} - {reference.max}
            </Text>
          </View>
        )}
        {reference.geoMean && (
          <View style={styles.statRow}>
            <Text style={[styles.statusIcon, { color: geoMeanStatus?.color }]}>
              {geoMeanStatus?.icon}
            </Text>
            <Text style={styles.statLabel}>Geometrik ort:</Text>
            <Text style={styles.statValue}>
              {(reference.geoMean.value - reference.geoMean.sd).toFixed(2)} -{" "}
              {(reference.geoMean.value + reference.geoMean.sd).toFixed(2)}
            </Text>
          </View>
        )}
        {reference.mean && (
          <View style={styles.statRow}>
            <Text style={[styles.statusIcon, { color: meanStatus?.color }]}>
              {meanStatus?.icon}
            </Text>
            <Text style={styles.statLabel}>Ortalama:</Text>
            <Text style={styles.statValue}>
              {(reference.mean.value - reference.mean.sd).toFixed(2)} -{" "}
              {(reference.mean.value + reference.mean.sd).toFixed(2)}
            </Text>
          </View>
        )}
        {reference.confidenceInterval && (
          <View style={styles.statRow}>
            <Text style={[styles.statusIcon, { color: confidenceStatus?.color }]}>
              {confidenceStatus?.icon}
            </Text>
            <Text style={styles.statLabel}>Confidence:</Text>
            <Text style={styles.statValue}>
              {reference.confidenceInterval[0].toFixed(2)} -{" "}
              {reference.confidenceInterval[1].toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTestDetails = () => {
    if (!selectedTest) return null;

    const age = calculateAgeAtDate(
      selectedUserData.birthDate,
      selectedTest.date
    );
    let ageText =
      age.years < 3 ? `${age.years * 12 + age.months} ay` : `${age.years} yaş`;

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
            if (!value) return null;

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

            const articleResults = getTestStatusForAllArticles(
              value,
              key,
              selectedTest.date
            );
            if (!articleResults?.length) return null;

            return (
              <View style={styles.testSection}>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  style={styles.testTitleContainer}
                >
                  <Text style={styles.testTitle}>{key}</Text>
                  <View style={styles.valueWrapper}>
                    {trend && <Text style={styles.trendText}>{trend}</Text>}
                    <Text style={styles.testValue}>{value}</Text>
                    <Text style={styles.expandIcon}>
                      {expandedItems[key] ? "-" : "+"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {expandedItems[key] && (
                  <View style={styles.articleResults}>
                    {articleResults.map((result, index) => (
                      <View key={index} style={styles.articleResult}>
                        <Text style={styles.articleName}>
                          {result.articleName}
                        </Text>
                        <View style={styles.resultDetails}>
                          {renderReferenceDetails(result)}
                        </View>
                        <Text style={styles.ageGroupText}>
                          Yaş Grubu: {result.ageGroup}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
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
      <View style={styles.searchPickerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Hasta ara..."
          value={searchQuery}
          onChangeText={(query) => {
            setSearchQuery(query);
            const filtered = users.filter(
              (user) =>
                user.fullName.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
          }}
          onFocus={() => setIsSearchActive(true)}
        />

        {isSearchActive && (
          <FlatList
            data={searchQuery ? filteredUsers : users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  setSelectedUser(item.id);
                  setSelectedTest(null);
                  fetchTests(item.id);
                  setSearchQuery(""); // Arama kutusunu sıfırla
                  setIsSearchActive(false); // Listeyi gizle
                }}
              >
                <Text style={styles.userText}>
                  {item.fullName} ({item.email})
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Kullanıcı bulunamadı</Text>
            }
          />
        )}
      </View>
      {selectedUser &&
        (selectedTest ? (
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
        ))}
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
  pickerContainer: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContainer: {
    padding: 10,
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
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
  testInfo: {
    flex: 1,
  },
  testDetailsContainer: {
    flex: 1,
  },
  detailsHeader: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
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
  ageContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  ageText: {
    fontSize: 14,
    color: "#666",
  },
  testSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 10,
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
  valueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  testValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  expandIcon: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  articleResults: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  articleResult: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  articleName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  resultDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  referenceText: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  ageGroupText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  trendText: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 5,
  },
  searchPickerContainer: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 10,
  },
  referenceDetails: {
    flex: 1,
    marginLeft: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  statValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  referenceLabel: {
    fontSize: 14,
    color: "#666",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});
