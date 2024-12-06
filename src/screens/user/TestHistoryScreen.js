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
import CustomButton from "../../components/CustomButton";

export default function TestHistoryScreen() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

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

  const getTestStatusForAllArticles = (value, testType, testDate) => {
    if (!referenceValues || !user.birthDate) return null;

    const results = [];
    for (const [articleId, article] of Object.entries(referenceValues)) {
      if (article.values[testType]) {
        const ageGroup = getAgeGroup(
          user.birthDate,
          testDate,
          testType,
          article.name
        );
        const reference = article.values[testType]?.[ageGroup];

        if (reference) {
          const status = {
            low: { status: "low", icon: "↓", color: "#ff3b30" },
            high: { status: "high", icon: "↑", color: "#ff9500" },
            normal: { status: "normal", icon: "↔", color: "#34c759" },
          }[
            value < reference.min
              ? "low"
              : value > reference.max
              ? "high"
              : "normal"
          ];

          results.push({
            articleName: article.name,
            reference,
            status,
            ageGroup,
          });
        }
      }
    }
    return results;
  };

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
          <Text style={styles.ageText}>Test tarihinde yaş: {ageText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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

            const articleResults = getTestStatusForAllArticles(value, key, selectedTest.date);
            if (!articleResults?.length) return null;

            return (
              <View style={styles.testSection}>
                <TouchableOpacity
                  onPress={() => setExpandedItems(prev => ({...prev, [key]: !prev[key]}))}
                  style={styles.testTitleContainer}
                >
                  <Text style={styles.testTitle}>{key}</Text>
                  <View style={styles.valueWrapper}>
                    <Text style={styles.testValue}>{value}</Text>
                    <Text style={styles.expandIcon}>{expandedItems[key] ? '↑' : '↓'}</Text>
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
                          <Text
                            style={[
                              styles.statusText,
                              { color: result.status.color },
                            ]}
                          >
                            {result.status.icon}
                          </Text>
                          <Text style={styles.referenceText}>
                            Referans: {result.reference.min} -{" "}
                            {result.reference.max}
                          </Text>
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

  const renderGuideDetails = () => {
    if (!selectedValue) return null;

    const { key, value, articleResults } = selectedValue;

    return (
      <View style={styles.guideDetailsContainer}>
        <View style={styles.detailsHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedValue(null)}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
          <Text style={styles.detailHeaderDate}>{key} Değerleri</Text>
        </View>
        <FlatList
          data={articleResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.articleResult}>
              <Text style={styles.articleName}>{item.articleName}</Text>
              <View style={styles.resultDetails}>
                <Text style={[styles.statusText, { color: item.status.color }]}>
                  {item.status.icon}
                </Text>
                <Text style={styles.referenceText}>
                  Referans: {item.reference.min} - {item.reference.max}
                </Text>
              </View>
              <Text style={styles.ageGroupText}>
                Yaş Grubu: {item.ageGroup}
              </Text>
            </View>
          )}
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
      {selectedTest ? (
        selectedValue ? (
          renderGuideDetails()
        ) : (
          renderTestDetails()
        )
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
  detailHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  backButton: {
    width: 100,
  },
  detailsList: {
    padding: 15,
  },
  testSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  articleResults: {
    marginTop: 5,
  },
  articleResult: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  articleName: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 6,
  },
  resultDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  detailHeaderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
    textAlign: "center",
  },
  guideDetailsContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  ageGroupText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  articleResults: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  articleResult: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  articleName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ageGroupText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  }
});
