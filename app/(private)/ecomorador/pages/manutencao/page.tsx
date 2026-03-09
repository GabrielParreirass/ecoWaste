import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import PageTop from "../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import DefaultButton from "../../../../components/DefaultButton";
import { router } from "expo-router";
import CustomModal from "../../../../components/popUps/CustomModal";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../utils/api_url.json";
import { createMqttOptions } from "../../../../utils/mqttOptions";

const Manutencao = () => {
  const [modalVisible, setmodalVisible] = useState(false);
  const { authState } = useAuth();
  const userEmail = authState?.loggedEmail;
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());
  const API_URL = apiUrl.apiUrl;

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/manutencaoResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/manutencaoResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedData = JSON.parse(message.toString());
      window.alert(formatedData.message);
    });
  }, []);

  const sendRequest = async (type: string) => {
    const payload = {
      userEmail,
      type,
      requestId: requestId.current,
    };
    client.current?.publish("user/manutencao", JSON.stringify(payload));
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="tools" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Problemas com sua lixeira? Não se preocupe, vamo te ajudar! Informe
          módulo com mal funcionamento:
        </Text>
      </View>
      <View style={styles.containerTopTrash}>
        <Pressable
          style={styles.cardTrash}
          onPress={() => {
            sendRequest("Papel");
            setmodalVisible(true);
          }}
        >
          <FontAwesome6 name="trash" size={70} color="blue" />
          <Text style={styles.textCard}>Papel</Text>
        </Pressable>
        <Pressable
          style={styles.cardTrash}
          onPress={() => {
            sendRequest("Plastico");
            setmodalVisible(true);
          }}
        >
          <FontAwesome6 name="trash" size={70} color="red" />
          <Text style={styles.textCard}>Plástico</Text>
        </Pressable>
        <Pressable
          style={styles.cardTrash}
          onPress={() => {
            sendRequest("Vidro");
            setmodalVisible(true);
          }}
        >
          <FontAwesome6 name="trash" size={70} color="green" />
          <Text style={styles.textCard}>Vidro</Text>
        </Pressable>
        <Pressable
          style={styles.cardTrash}
          onPress={() => {
            sendRequest("Metal");
            setmodalVisible(true);
          }}
        >
          <FontAwesome6 name="trash" size={70} color="#ffb800" />
          <Text style={styles.textCard}>Metal</Text>
        </Pressable>
      </View>
      <View style={styles.containerTopTrash}>
        <Pressable
          style={styles.cardTrash}
          onPress={() => {
            sendRequest("Todos");
            setmodalVisible(true);
          }}
        >
          <Fontisto name="recycle" size={70} color="black" />
          <Text style={styles.textCard}>TODOS</Text>
        </Pressable>
      </View>

      <View style={{ width: "70%", margin: "auto", padding: 10 }}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setmodalVisible(false)}
        message="Recebemos sua solicitação e em breve entraremos em contato para agenda um atendimento!"
        showInput={false}
        onConfirm={() => {
          setmodalVisible(false);
        }}
        confirmButtonText="Confirmar"
      />
    </ScrollView>
  );
};

export default Manutencao;

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
  containerTopTrash: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    marginTop: 30,
  },
  cardTrash: {},
  textCard: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
