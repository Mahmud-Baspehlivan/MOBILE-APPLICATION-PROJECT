import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ReferenceValuesUploadScreen() {
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchReferenceValues();
  }, []);

  const fetchReferenceValues = async () => {
    try {
      const docRef = doc(db, "settings", "referenceValues");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReferenceValues(docSnap.data().values); w
        console.log("Firestore'dan gelen veri:", docSnap.data().values);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reference values:", error);
      setLoading(false);
    }
  };

  const parseAgeRange = (ageRange) => {
    const isMonths = ageRange.includes("months");
    const isYears = ageRange.includes("years");
    const [start, end] = ageRange
      .replace("Older than ", "")
      .replace(" years", "")
      .replace(" months", "")
      .split("-");
    const startValue = parseFloat(start) || 0;
    const endValue = parseFloat(end) || Infinity;
    return { isMonths, isYears, startValue, endValue };
  };

  const sortAgeRanges = (a, b) => {
    const rangeA = parseAgeRange(a);
    const rangeB = parseAgeRange(b);

    if (rangeA.isMonths && rangeB.isYears) return -1;
    if (rangeA.isYears && rangeB.isMonths) return 1;

    return rangeA.startValue - rangeB.startValue || rangeA.endValue - rangeB.endValue;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const testOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.articleButtons}>
        {referenceValues &&
          Object.entries(referenceValues).map(([articleId, articleData]) => (
            <TouchableOpacity
              key={articleId}
              style={[
                styles.articleButton,
                selectedArticle === articleId && styles.selectedArticleButton,
              ]}
              onPress={() =>
                setSelectedArticle(
                  articleId === selectedArticle ? null : articleId
                )
              }
            >
              <Text
                style={[
                  styles.articleButtonText,
                  selectedArticle === articleId && styles.selectedArticleButtonText,
                ]}
              >
                {articleData.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      {selectedArticle && referenceValues && (
        <View style={styles.valuesContainer}>
          <Text style={styles.selectedArticleTitle}>
            {referenceValues[selectedArticle].name}
          </Text>

          {Object.entries(referenceValues[selectedArticle].values)
            .sort(([keyA], [keyB]) => {
              // Test sıralamasına göre sıralama
              const indexA = testOrder.indexOf(keyA);
              const indexB = testOrder.indexOf(keyB);
              return indexA - indexB;
            })
            .map(([testType, ageGroups]) => (
              <View key={testType} style={styles.testTypeSection}>
                <Text style={styles.testTypeTitle}>{testType}</Text>
                {Object.entries(ageGroups)
                  .sort(([ageA], [ageB]) => sortAgeRanges(ageA, ageB)) // Yaş aralıklarını sıralama
                  .map(([ageRange, values]) => (
                    <View key={ageRange} style={styles.rangeRow}>
                      <Text style={styles.ageRangeText}>{ageRange}</Text>
                      <Text style={styles.valuesText}>
                        Min: {values.min.toFixed(3)} - Max: {values.max.toFixed(3)}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  testTypeContainer: {
    marginBottom: 16,
  },
  testTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginBottom: 4,
  },
  articleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  articleButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    minWidth: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedArticleButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  articleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  selectedArticleButtonText: {
    color: "#fff",
  },
  valuesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  selectedArticleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  testTypeSection: {
    marginBottom: 20,
  },
  testTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 4,
    borderRadius: 6,
  },
  ageRangeText: {
    fontSize: 14,
    color: "#666",
  },
  valuesText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
