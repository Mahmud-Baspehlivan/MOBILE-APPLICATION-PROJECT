import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

export default function ReferenceValuesUploadScreen() {
  const [loading, setLoading] = useState(true);
  const [referenceValues, setReferenceValues] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedTest, setSelectedTest] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("months");
  const [result, setResult] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [selectedGuidelineTest, setSelectedGuidelineTest] = useState(null);

  const testTypes = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

  useEffect(() => {
    fetchReferenceValues();
  }, []);

  const fetchReferenceValues = async () => {
    try {
      const docRef = doc(db, "settings", "referenceValues");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReferenceValues(docSnap.data().values);
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
    const isDays = ageRange.includes("days");

    // "Older than" durumu için özel kontrol
    if (ageRange.includes("Older than")) {
      const value = parseFloat(
        ageRange
          .replace("Older than ", "")
          .replace(" years", "")
          .replace(" months", "")
      );
      return {
        isMonths,
        isYears,
        isDays,
        startValue: value,
        endValue: Infinity,
      };
    }

    // Normal aralık durumu
    const [start, end] = ageRange
      .replace(" years", "")
      .replace(" months", "")
      .replace(" days", "")
      .split("-");

    return {
      isMonths,
      isYears,
      isDays,
      startValue: parseFloat(start) || 0,
      endValue: parseFloat(end) || Infinity,
    };
  };

  const [testValues, setTestValues] = useState({
    IgA: "",
    IgM: "",
    IgG: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
  });

  const calculateResults = () => {
    if (!selectedAge || !referenceValues) {
      alert("Lütfen yaş bilgisini doldurun");
      return;
    }

    const results = [];
    const age = parseFloat(selectedAge);

    // Her bir kılavuz için kontrol
    Object.entries(referenceValues).forEach(([articleId, articleData]) => {
      // Her bir test tipi için kontrol
      Object.entries(testValues).forEach(([testType, value]) => {
        if (!value) return; // Boş değerleri atla

        const testValue = parseFloat(value);
        if (isNaN(testValue)) return;

        if (articleData.values && articleData.values[testType]) {
          const ageGroups = articleData.values[testType];
          let matchingRange = null;
          let matchingValues = null;

          Object.entries(ageGroups).forEach(([ageRange, values]) => {
            const { isMonths, isYears, isDays, startValue, endValue } =
              parseAgeRange(ageRange);
            const ageInDays = age * (ageUnit === "years" ? 365 : 30);
            const startInDays = startValue * (isDays ? 1 : isMonths ? 30 : 365);
            const endInDays = endValue * (isDays ? 1 : isMonths ? 30 : 365);

            if (ageInDays >= startInDays && ageInDays <= endInDays) {
              matchingRange = ageRange;
              matchingValues = values;
            }
          });

          if (matchingValues) {
            results.push({
              articleName: articleData.name,
              testType,
              range: matchingRange,
              min: matchingValues.min,
              max: matchingValues.max,
              value: testValue,
              status:
                testValue < (matchingValues.min ?? 0)
                  ? "Düşük"
                  : testValue > (matchingValues.max ?? 0)
                  ? "Yüksek"
                  : "Normal",
              geoMean: matchingValues.geoMean,
              mean: matchingValues.mean,
              confidence: matchingValues.confidenceInterval
                ? `${matchingValues.confidenceInterval[0]} - ${matchingValues.confidenceInterval[1]}`
                : "Mevcut değil",
            });
          }
        }
      });
    });

    setResult(results);
  };

  const sortAgeRanges = (a, b) => {
    const rangeA = parseAgeRange(a);
    const rangeB = parseAgeRange(b);

    if (rangeA.isMonths && rangeB.isYears) return -1;
    if (rangeA.isYears && rangeB.isMonths) return 1;

    return (
      rangeA.startValue - rangeB.startValue || rangeA.endValue - rangeB.endValue
    );
  };

  // Sonuçları test tiplerine göre grupla
  const groupResultsByTestType = (results) => {
    const grouped = {};
    results.forEach((result) => {
      if (!grouped[result.testType]) {
        grouped[result.testType] = [];
      }
      grouped[result.testType].push(result);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              !showGuidelines && styles.activeTabButton,
            ]}
            onPress={() => setShowGuidelines(false)}
          >
            <Text
              style={[
                styles.tabButtonText,
                !showGuidelines && styles.activeTabButtonText,
              ]}
            >
              Hesaplama Görünümü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, showGuidelines && styles.activeTabButton]}
            onPress={() => setShowGuidelines(true)}
          >
            <Text
              style={[
                styles.tabButtonText,
                showGuidelines && styles.activeTabButtonText,
              ]}
            >
              Kılavuz Görünümü
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {!showGuidelines ? (
        <View style={styles.calculatorContainer}>
          <View style={styles.testInputGroups}>
            {/* Sol taraf - Ana Ig'ler */}
            <View style={styles.testInputColumn}>
              {["IgA", "IgM", "IgG"].map((testType) => (
                <View key={testType} style={styles.testInputWrapper}>
                  <Text style={styles.testInputLabel}>{testType}</Text>
                  <TextInput
                    style={styles.testInput}
                    value={testValues[testType]}
                    onChangeText={(value) =>
                      setTestValues((prev) => ({ ...prev, [testType]: value }))
                    }
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
              ))}
            </View>

            {/* Sağ taraf - IgG alt tipleri */}
            <View style={styles.testInputColumn}>
              {["IgG1", "IgG2", "IgG3", "IgG4"].map((testType) => (
                <View key={testType} style={styles.testInputWrapper}>
                  <Text style={styles.testInputLabel}>{testType}</Text>
                  <TextInput
                    style={styles.testInput}
                    value={testValues[testType]}
                    onChangeText={(value) =>
                      setTestValues((prev) => ({ ...prev, [testType]: value }))
                    }
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Age Input - Keep existing age input code */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Yaş</Text>
            <View style={styles.ageInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={selectedAge}
                onChangeText={setSelectedAge}
                keyboardType="numeric"
                placeholder="Yaş giriniz"
              />
              <Picker
                selectedValue={ageUnit}
                onValueChange={(itemValue) => setAgeUnit(itemValue)}
                style={styles.ageUnitPicker}
              >
                <Picker.Item label="Ay" value="months" />
                <Picker.Item label="Yıl" value="years" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateResults}
          >
            <Text style={styles.calculateButtonText}>Hesapla</Text>
          </TouchableOpacity>

          {/* Results Display - Updated Card Design */}
          {result && (
            <View style={styles.resultsContainer}>
              {Object.entries(groupResultsByTestType(result)).map(
                ([testType, results]) => (
                  <View key={testType} style={styles.testResultCard}>
                    <View style={styles.testResultHeader}>
                      <Text style={styles.testResultTitle}>{testType}</Text>
                      <Text style={styles.testResultValue}>
                        Girilen değer: {results[0].value.toFixed(2)}
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {results.map((item, index) => (
                        <View
                          key={index}
                          style={[
                            styles.guidelineResultCard,
                            {
                              borderColor:
                                item.status === "Düşük"
                                  ? "#ff3b30"
                                  : item.status === "Yüksek"
                                  ? "#ff9500"
                                  : "#34c759",
                            },
                          ]}
                        >
                          <Text style={styles.guidelineName}>
                            {item.articleName}
                          </Text>
                          <View style={styles.resultDetails}>
                            <Text style={styles.guidelineLabel}>
                              Yaş Aralığı:
                            </Text>
                            <Text style={styles.guidelineValue}>
                              {item.range}
                            </Text>

                            <Text style={styles.guidelineLabel}>
                              Referans Aralığı:
                            </Text>
                            <Text style={styles.guidelineValue}>
                              {item.min?.toFixed(2)} - {item.max?.toFixed(2)}
                            </Text>

                            <Text style={styles.guidelineLabel}>
                              Geometrik Ortalama:
                            </Text>
                            <Text style={styles.guidelineValue}>
                              {item.geoMean
                                ? typeof item.geoMean === "object"
                                  ? `${item.geoMean.value?.toFixed(
                                      2
                                    )} ± ${item.geoMean.sd?.toFixed(2)}`
                                  : item.geoMean?.toFixed(2)
                                : "Mevcut değil"}
                            </Text>

                            <Text style={styles.guidelineLabel}>
                              Aritmetik Ortalama:
                            </Text>
                            <Text style={styles.guidelineValue}>
                              {item.mean
                                ? typeof item.mean === "object"
                                  ? `${item.mean.value?.toFixed(
                                      2
                                    )} ± ${item.mean.sd?.toFixed(2)}`
                                  : item.mean?.toFixed(2)
                                : "Mevcut değil"}
                            </Text>

                            <Text style={styles.guidelineLabel}>
                              Güven Aralığı:
                            </Text>
                            <Text style={styles.guidelineValue}>
                              {item.confidence}
                            </Text>
                          </View>

                          <Text
                            style={[
                              styles.guidelineStatus,
                              item.status === "Düşük" && styles.lowStatus,
                              item.status === "Yüksek" && styles.highStatus,
                              item.status === "Normal" && styles.normalStatus,
                            ]}
                          >
                            Durum: {item.status}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.guidelinesContainer}>
          <View style={styles.articleButtons}>
            {referenceValues &&
              Object.entries(referenceValues).map(
                ([articleId, articleData]) => (
                  <TouchableOpacity
                    key={articleId}
                    style={[
                      styles.guidelineArticleButton,
                      selectedArticle === articleId &&
                        styles.selectedGuidelineArticleButton,
                    ]}
                    onPress={() => {
                      setSelectedArticle(articleId);
                      setSelectedGuidelineTest(null); // Reset selected test when article changes
                    }}
                  >
                    <Text
                      style={[
                        styles.guidelineArticleButtonText,
                        selectedArticle === articleId &&
                          styles.selectedGuidelineArticleButtonText,
                      ]}
                    >
                      {articleData.name}
                    </Text>
                  </TouchableOpacity>
                )
              )}
          </View>

          {selectedArticle && referenceValues && (
            <View style={styles.valuesContainer}>
              <Text style={styles.selectedArticleTitle}>
                {referenceValues[selectedArticle]?.name}
              </Text>

              <View style={styles.testTypeButtons}>
                {testTypes.map((testType) => (
                  <TouchableOpacity
                    key={testType}
                    style={[
                      styles.testTypeButton,
                      selectedGuidelineTest === testType &&
                        styles.selectedTestTypeButton,
                    ]}
                    onPress={() => setSelectedGuidelineTest(testType)}
                  >
                    <Text
                      style={[
                        styles.testTypeButtonText,
                        selectedGuidelineTest === testType &&
                          styles.selectedTestTypeButtonText,
                      ]}
                    >
                      {testType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedGuidelineTest &&
                referenceValues[selectedArticle]?.values[
                  selectedGuidelineTest
                ] && (
                  <View style={styles.testTypeSection}>
                    <Text style={styles.testTypeTitle}>
                      {selectedGuidelineTest}
                    </Text>
                    {Object.entries(
                      referenceValues[selectedArticle].values[
                        selectedGuidelineTest
                      ]
                    )
                      .sort(([ageA], [ageB]) => sortAgeRanges(ageA, ageB))
                      .map(([ageRange, values]) => (
                        <View key={ageRange} style={styles.rangeRow}>
                          <Text style={styles.ageRangeText}>{ageRange}</Text>
                          <View style={styles.valuesDetailContainer}>
                            <Text style={styles.valuesText}>
                              Referans Aralığı: {values.min?.toFixed(2)} -{" "}
                              {values.max?.toFixed(2)}
                            </Text>
                            {values.mean && (
                              <Text style={styles.valuesText}>
                                Ortalama:{" "}
                                {typeof values.mean === "object"
                                  ? `${values.mean.value?.toFixed(
                                      2
                                    )} ± ${values.mean.sd?.toFixed(2)}`
                                  : values.mean?.toFixed(2)}
                              </Text>
                            )}
                            {values.geoMean && (
                              <Text style={styles.valuesText}>
                                Geometrik Ortalama:{" "}
                                {typeof values.geoMean === "object"
                                  ? `${values.geoMean.value?.toFixed(
                                      2
                                    )} ± ${values.geoMean.sd?.toFixed(2)}`
                                  : values.geoMean?.toFixed(2)}
                              </Text>
                            )}
                            {values.confidenceInterval && (
                              <Text style={styles.valuesText}>
                                Güven Aralığı:{" "}
                                {values.confidenceInterval[0]?.toFixed(2)} -{" "}
                                {values.confidenceInterval[1]?.toFixed(2)}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                )}
            </View>
          )}
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
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
    borderRadius: 6,
  },
  ageRangeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 4,
  },
  valuesText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calculatorContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lowStatus: {
    color: "#ff3b30",
  },
  highStatus: {
    color: "#ff9500",
  },
  normalStatus: {
    color: "#34c759",
  },
  ageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ageUnitPicker: {
    marginLeft: 10,
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#007AFF",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  viewToggleButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewToggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  guidelinesContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  guidelineArticleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  guidelineArticleButton: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    minWidth: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedGuidelineArticleButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  guidelineArticleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedGuidelineArticleButtonText: {
    color: "#fff",
  },
  valuesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testTypeSection: {
    marginBottom: 24,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
  },
  testTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  rangeRow: {
    flexDirection: "column",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  ageRangeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 6,
  },
  valuesDetailContainer: {
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderRadius: 6,
  },
  valuesText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  selectedArticleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  testTypeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  testTypeButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: "22%",
    alignItems: "center",
  },
  selectedTestTypeButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  testTypeButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedTestTypeButtonText: {
    color: "#fff",
  },
  testInputsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  testInputWrapper: {
    width: "48%",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  testInputLabel: {
    fontSize: 14,
    color: "#666",
    width: "40%",
  },

  testInput: {
    flex: 1,
    height: 32,
    fontSize: 14,
    padding: 4,
    textAlign: "right",
  },
  testInputGroups: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  testInputColumn: {
    width: "48%",
  },

  testInputWrapper: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  testInputLabel: {
    fontSize: 14,
    color: "#666",
    width: "40%",
  },

  testInput: {
    flex: 1,
    height: 32,
    fontSize: 14,
    padding: 4,
    textAlign: "right",
  },
  resultsContainer: {
    marginTop: 16,
  },

  testResultCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  testResultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  testResultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  testResultValue: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },

  guidelineResultCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    width: 280, // Genişletildi
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  resultDetails: {
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },

  guidelineLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },

  guidelineValue: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "600",
  },

  guidelineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },

  guidelineStatus: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#f8f8f8",
  },
});
