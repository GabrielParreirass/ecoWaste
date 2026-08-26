import { View, Text, Pressable, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import PageTop from "../../../../components/PageTop";
import { useAuth } from "../../../../../contexts/AuthContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";

const HomeEcotaxista = () => {
  const { onLogout } = useAuth();

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView>
        <PageTop profile={true} />
        <Text style={styles.title}>Bem-vindo a sua central de serviços</Text>
        <View style={styles.containerCards}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              router.navigate("/ecotaxista/pages/residuosDisponiveis/page")
            }
          >
            <FontAwesome5 name="map-marked-alt" size={60} color="white" />
            <Text style={styles.textCard}>Resíduos disponíveis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              router.navigate("/(private)/ecotaxista/pages/reservas/page")
            }
          >
            <FontAwesome5 name="calendar-check" size={60} color="white" />
            <Text style={styles.textCard}>Reservas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerCards}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              router.navigate("/(private)/ecomorador/pages/ecocoins/page")
            }
          >
            <FontAwesome5 name="wallet" size={60} color="white" />
            <Text style={styles.textCard}>Eco Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              router.navigate("/(private)/ecomorador/pages/beneficios/page")
            }
          >
            <FontAwesome5 name="medal" size={55} color="white" />
            <Text style={styles.textCard}>Benefícios</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.button} onPress={() => onLogout!()}>
            <Text style={styles.textButton}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeEcotaxista;

const styles = StyleSheet.create({
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
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
