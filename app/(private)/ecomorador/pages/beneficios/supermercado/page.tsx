import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import PageTop from "../../../../../components/PageTop";
import Foundation from "@expo/vector-icons/Foundation";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultButton from "../../../../../components/DefaultButton";

const DescontoSupermercado = () => {
  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Foundation name="shopping-cart" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Nossos parceiros oferecem descontos para você. Consulte cupons
          disponíveis e seus cupons.
        </Text>
      </View>
      <View style={styles.containerBtns}>
        <TouchableOpacity
        activeOpacity={0.7}
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/beneficios/supermercado/cuponsDisponiveis/page"
            )
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <MaterialIcons name="discount" size={80} color="white" />
            <Text style={styles.textButton}>Cupons</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
        activeOpacity={0.7}
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/beneficios/supermercado/meusCupons/page"
            )
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <FontAwesome name="shopping-bag" size={80} color="white" />
            <Text style={styles.textButton}>Meus cupons</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={{ width: "70%", margin: "auto" }}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>
    </ScrollView>
  );
};

export default DescontoSupermercado;

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
