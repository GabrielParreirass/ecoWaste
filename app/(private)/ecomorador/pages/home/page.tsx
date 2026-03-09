import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import PageTop from "../../../../components/PageTop";
import { useAuth } from "../../../../../contexts/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../utils/api_url.json";
import { createMqttOptions } from "../../../../utils/mqttOptions";

const HomeEcomorador = () => {
  const { onLogout, authState } = useAuth();
  const [temLixeira, setTemLixeira] = useState(true);
  const [coletas, setColetas] = useState([]);
  const loggedEmail = authState?.loggedEmail;

  const client = useRef<MqttClient | null>(null);

  const requestId = useRef(Date.now().toString());
  const API_URL = apiUrl.apiUrl;

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getUserDataResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getUserDataResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedData = JSON.parse(message.toString());
      setTemLixeira(formatedData.user.temLixeira);
      setColetas(formatedData.user.coletas);
    });

    const payload = {
      email: loggedEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/getUserData", JSON.stringify(payload));
  }, []);

  return (
    <ScrollView>
      <PageTop profile={true} />
      <Text style={styles.title}>Bem-vindo a sua central de serviços</Text>
      <View style={styles.containerCards}>
        {temLixeira ? (
          <View>
            <TouchableOpacity activeOpacity={0.7} style={styles.card}>
              <Entypo name="trash" size={60} color="white" />
              <Text style={styles.textCard}>
                {coletas.length} Coleta(s) em espera
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.navigate(
                  "/(private)/ecomorador/pages/solicitarColeta/page"
                )
              }
            >
              <Entypo name="trash" size={60} color="white" />
              <Text style={styles.textCard}>Solicitar coleta</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/ecocoins/page")
          }
        >
          <Entypo name="wallet" size={60} color="white" />
          <Text style={styles.textCard}>Eco coins</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerCards}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() =>
            router.navigate("/(private)/ecomorador/pages/manutencao/page")
          }
        >
          <FontAwesome5 name="tools" size={55} color="white" />
          <Text style={styles.textCard}>Manutenção</Text>
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
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => onLogout!()}>
          <Text style={styles.textButton}>Sair</Text>
        </TouchableOpacity>
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
