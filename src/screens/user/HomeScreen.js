import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={styles.gradient}
      />
      <View style={styles.container}>
        {/* Yeni eklenen View */}
        <View style={styles.box}>
          <Text style={styles.welcome}>Hoş Geldiniz!</Text>
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Arka planı yarı saydam beyaz yaptık
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
  welcome: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000", // Metin rengini siyah yaptık
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: "#000", // Metin rengini siyah yaptık
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
