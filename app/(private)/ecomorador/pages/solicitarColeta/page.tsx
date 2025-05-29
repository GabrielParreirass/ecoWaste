import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React from "react";
import PageTop from "../../../../components/PageTop";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const SolicitarColeta = () => {
  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Entypo name="trash" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerCards}>
        <Pressable style={styles.card} onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/solicitarColeta/novaColeta/page"
            )
          }>
          <FontAwesome5 name="trash-restore" size={55} color="white" />
          <Text style={styles.textCard}>Nova coleta</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/solicitarColeta/coletasEmEspera/page"
            )
          }>
          <Ionicons name="time-outline" size={60} color="white" />
          <Text style={styles.textCard}>Coleta em espera</Text>
        </Pressable>
      </View>
     
      <View style={styles.containerButton}>
        <Pressable style={styles.button} onPress={() => router.replace("/(private)/ecomorador/pages/home/page")}>
          <Text style={styles.textButton}>Voltar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SolicitarColeta;

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
  title: {
    color: "#0fa05f",
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
    fontSize: 20,
  },
  containerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    width: "100%",
    gap: 20,
  },
  card: {
    backgroundColor: "#0fa05f",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 175,
    width: 150,
    borderRadius: 10,
  },
  textCard: {
    color: "#fff",
    paddingTop: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  containerButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0fa05f",
    padding: 15,
    width: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom:20
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
