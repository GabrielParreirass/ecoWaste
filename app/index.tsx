import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { router, Router } from "expo-router";
import { Image } from "react-native";
import { useState } from "react";

const Index = () => {

  


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0097b2", "#7ed957"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.backgournd}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Conectando você a um mundo sustentável</Text>
        <Image
          source={require("../assets/images/imgHome.png")}
          style={styles.imgHome}
        />
        <View style={styles.containerButtons}>
          <Pressable
            style={styles.button}
            onPress={() => router.navigate("/(auth)/logIn/page")}
          >
            <Text style={styles.textButton}>LogIn</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => router.navigate("/(auth)/signUp/page")}
            
          >
            <Text style={styles.textButton}>Cadastro</Text>
          </Pressable>
        </View>
      </LinearGradient>

      
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgournd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 200,
  },
  imgHome: {
    height: 250,
    width: 250,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginTop: 30,
  },
  containerButtons: {
    display: "flex",
    flexDirection: "row",
    marginTop: 30,
    gap: 20,
  },
  button: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    width: 130,
    borderRadius: 10,
  },
  textButton: {
    color: "#0fa05f",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
  },
});
