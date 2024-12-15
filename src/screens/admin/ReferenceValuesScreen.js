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
  const [ageUnit, setAgeUnit] = useState("months"); // Eklenen kısım
  const [result, setResult] = useState(null);

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

  const calculateResult = () => {
    if (
      !selectedArticle ||
      !selectedTest ||
      !inputValue ||
      !selectedAge ||
      !referenceValues
    ) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      alert("Geçerli bir değer girin");
      return;
    }

    const articleData = referenceValues[selectedArticle];
    if (
      !articleData ||
      !articleData.values ||
      !articleData.values[selectedTest]
    ) {
      alert("Seçilen test için referans değerleri bulunamadı");
      return;
    }

    const ageGroups = articleData.values[selectedTest];
    const age = parseFloat(selectedAge);

    let matchingRange = null;
    let matchingValues = null;

    Object.entries(ageGroups).forEach(([ageRange, values]) => {
      const { isMonths, isYears, isDays, startValue, endValue } =
        parseAgeRange(ageRange);

      // Yaşı ve aralıkları günlere çevir
      const ageInDays = age * (ageUnit === "years" ? 365 : 30);
      const startInDays = startValue * (isDays ? 1 : isMonths ? 30 : 365);
      const endInDays = endValue * (isDays ? 1 : isMonths ? 30 : 365);

      if (ageInDays >= startInDays && ageInDays <= endInDays) {
        matchingRange = ageRange;
        matchingValues = values;
      }
    });

    if (matchingValues) {
      try {
        const result = {
          range: matchingRange,
          min: matchingValues.min, 
          max: matchingValues.max, 
          value: value,
          status:
            value < (matchingValues.min ?? 0)
              ? "Düşük"
              : value > (matchingValues.max ?? 0)
              ? "Yüksek"
              : "Normal",
        };

        // Optional değerler için kontroller
        if (matchingValues.geoMean) {
          if (typeof matchingValues.geoMean === "object") {
            result.geoMean = {
              value: matchingValues.geoMean.value ?? 0,
              sd: matchingValues.geoMean.sd ?? 0,
            };
          } else {
            result.geoMean = matchingValues.geoMean;
          }
        } else {
          result.geoMean = 0;
        }

        if (matchingValues.mean) {
          if (typeof matchingValues.mean === "object") {
            result.mean = {
              value: matchingValues.mean.value ?? 0,
              sd: matchingValues.mean.sd ?? 0,
            };
          } else {
            result.mean = matchingValues.mean;
          }
        } else {
          result.mean = 0;
        }

        // Confidence interval kontrolü
        if (
          matchingValues.confidenceInterval &&
          Array.isArray(matchingValues.confidenceInterval) &&
          matchingValues.confidenceInterval.length >= 2
        ) {
          result.confidence = `${matchingValues.confidenceInterval[0]} - ${matchingValues.confidenceInterval[1]}`;
        } else {
          result.confidence = "Mevcut değil";
        }

        setResult(result);
      } catch (error) {
        console.error("Değer hesaplama hatası:", error);
        alert("Değerler hesaplanırken bir hata oluştu");
      }
    } else {
      alert("Bu yaş için referans aralığı bulunamadı");
    }
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
                  selectedArticle === articleId &&
                    styles.selectedArticleButtonText,
                ]}
              >
                {articleData.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Hesaplama Bölümü */}
      <View style={styles.calculatorContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Test Tipi</Text>
          <Picker
            selectedValue={selectedTest}
            onValueChange={(itemValue) => setSelectedTest(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seçiniz" value="" />
            {testTypes.map((test) => (
              <Picker.Item key={test} label={test} value={test} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Değer</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder="Değer giriniz"
          />
        </View>

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
          onPress={calculateResult}
        >
          <Text style={styles.calculateButtonText}>Hesapla</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Sonuç</Text>
            <Text style={styles.resultText}>Yaş Aralığı: {result.range}</Text>
            <Text style={styles.resultText}>
              Min: {result.min?.toFixed(3) ?? "Mevcut değil"}
            </Text>
            <Text style={styles.resultText}>
              Max: {result.max?.toFixed(3) ?? "Mevcut değil"}
            </Text>

            {/* Geometric Mean kontrolü */}
            <Text style={styles.resultText}>
              Geometric Mean:{" "}
              {result.geoMean
                ? typeof result.geoMean === "object"
                  ? `${(result.geoMean.value - result.geoMean.sd).toFixed(
                      3
                    )} - ${(result.geoMean.value + result.geoMean.sd).toFixed(
                      3
                    )}`
                  : result.geoMean.toFixed(3)
                : "Mevcut değil"}
            </Text>

            {/* Mean kontrolü */}
            <Text style={styles.resultText}>
              Mean:{" "}
              {result.mean
                ? typeof result.mean === "object"
                  ? `${(result.mean.value - result.mean.sd).toFixed(3)} - ${(
                      result.mean.value + result.mean.sd
                    ).toFixed(3)}`
                  : result.mean.toFixed(3)
                : "Mevcut değil"}
            </Text>

            <Text style={styles.resultText}>
              Confidence: {result.confidence}
            </Text>

            <Text
              style={[
                styles.resultText,
                styles.statusText,
                result.status === "Düşük" && styles.lowStatus,
                result.status === "Yüksek" && styles.highStatus,
                result.status === "Normal" && styles.normalStatus,
              ]}
            >
              Durum: {result.status}
            </Text>
          </View>
        )}
      </View>
      {/* {selectedArticle && referenceValues && (
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
      )} */}
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
});
