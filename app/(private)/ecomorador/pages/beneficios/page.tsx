import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import PageTop from "../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import DefaultButton from "../../../../components/DefaultButton";

const Beneficios = () => {
  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="medal" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Aqui você recilca e tem vantagens, confira seus benefícios:
        </Text>
      </View>
      <View style={styles.containerBtns}>
        <Pressable
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/beneficios/iptu/page")
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <FontAwesome6 name="house-chimney" size={80} color="white" />
            <Text style={styles.textButton}>Desconto no IPTU</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/beneficios/supermercado/page"
            )
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Foundation name="shopping-cart" size={80} color="white" />
            <Text style={styles.textButton}>Descontos no supermercado</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={{ width: "70%", margin: "auto" }}>
        <DefaultButton text={"Voltar"} onPressButton={()=> router.back()}/>
      </View>
    </ScrollView>
  );
};

export default Beneficios;

const styles = StyleSheet.create({
  containerIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "white",
    borderRadius: "50%",
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    borderColor: "#96cda9",
    borderWidth: 4,
  },
  containerTitle: {
    maxWidth: "90%",
    margin: "auto",
    padding: 10,
  },
  title: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  containerBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 30,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    maxWidth: 170,
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
});
