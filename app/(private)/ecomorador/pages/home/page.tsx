import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React from "react";
import PageTop from "../../../../components/PageTop";
import { useAuth } from "../../../../contexts/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";

const HomeEcomorador = () => {
  const { onLogout } = useAuth();

  return (
    <ScrollView>
      <PageTop profile={true} />
      <Text style={styles.title}>Bem-vindo a sua central de serviços</Text>
      <View style={styles.containerCards}>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/solicitarColeta/page")
          }
        >
          <Entypo name="trash" size={60} color="white" />
          <Text style={styles.textCard}>Solicitar coleta</Text>
        </Pressable>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/ecocoins/page")
          }
        >
          <Entypo name="wallet" size={60} color="white" />
          <Text style={styles.textCard}>Eco coins</Text>
        </Pressable>
      </View>
      <View style={styles.containerCards}>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/manutencao/page")
          }
        >
          <FontAwesome5 name="tools" size={55} color="white" />
          <Text style={styles.textCard}>Manutenção</Text>
        </Pressable>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/beneficios/page")
          }
        >
          <FontAwesome5 name="medal" size={55} color="white" />
          <Text style={styles.textCard}>Benefícios</Text>
        </Pressable>
      </View>
      <View style={styles.containerButton}>
        <Pressable style={styles.button} onPress={() => onLogout!()}>
          <Text style={styles.textButton}>Sair</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default HomeEcomorador;

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
