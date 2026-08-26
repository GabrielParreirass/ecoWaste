import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import PageTop from "../../../../components/PageTop";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../utils/api_url.json";
import { createMqttOptions } from "../../../../utils/mqttOptions";
import QRCodeScanner from "../../../../components/QrCodeReader";

const SolicitarColeta = () => {
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;
  const [userId, setUserId] = React.useState("");
  const [showQrCode, setShowQrCode] = React.useState(false);
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());
  const API_URL = apiUrl.apiUrl;
  const options = createMqttOptions();
  const [showQrCodeScanner, setShowQrCodeScanner] = React.useState(false);

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getUserDataResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getUserDataResponse/${requestId.current}`,
            );
          }
        },
      );

      client.current?.subscribe(
        `user/cadastrarLixeiraResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/cadastrarLixeiraResponse/${requestId.current}`,
            );
          }
        },
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);

      if (topic == `user/getUserDataResponse/${requestId.current}`) {
        const formatedData = JSON.parse(message.toString());
        setUserId(formatedData.user.id);
      }

      if (topic == `user/cadastrarLixeiraResponse/${requestId.current}`) {
        const formatedData = JSON.parse(message.toString());
        alert(formatedData.message);
        router.navigate("/(private)/ecomorador/pages/home/page");
      }
    });

    const payload = {
      email: loggedEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/getUserData", JSON.stringify(payload));
  }, []);

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Entypo name="trash" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerCards}>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/solicitarColeta/novaColeta/page",
            )
          }
        >
          <FontAwesome5 name="trash-restore" size={55} color="white" />
          <Text style={styles.textCard}>Nova coleta</Text>
        </Pressable>
        <Pressable
          style={styles.card}
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/solicitarColeta/coletasEmEspera/page",
            )
          }
        >
          <Ionicons name="time-outline" size={60} color="white" />
          <Text style={styles.textCard}>Coleta em espera</Text>
        </Pressable>
      </View>
      <View style={styles.containerCards}>
        <Pressable
          style={styles.card}
          onPress={() => setShowQrCodeScanner(true)}
        >
          <Entypo name="trash" size={80} color="white" />
          <Text style={styles.textCard}>Cadastrar Lixeira</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => setShowQrCode(true)}>
          <MaterialIcons name="qr-code-2" size={80} color="white" />
          <Text style={styles.textCard}>QR Code de confirmação</Text>
        </Pressable>
      </View>

      {showQrCode && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <QRCode
            value={userId}
            size={200}
            color="black"
            backgroundColor="white"
          />
          <Pressable style={styles.button} onPress={() => setShowQrCode(false)}>
            <Text style={styles.textButton}>Fechar</Text>
          </Pressable>
        </View>
      )}

      {showQrCodeScanner && (
        <View style={StyleSheet.absoluteFillObject}>
          <QRCodeScanner
            onScan={(data: any) => {
              console.log("QR code lido:", data);
              setShowQrCodeScanner(false);
              client.current?.publish(
                "user/cadastrarLixeira",
                JSON.stringify({
                  email: loggedEmail,
                  lixeiraId: data,
                  requestId: requestId.current,
                }),
              );
            }}
          />
        </View>
      )}

      <View style={styles.containerButton}>
        <Pressable
          style={styles.button}
          onPress={() =>
            router.replace("/(private)/ecomorador/pages/home/page")
          }
        >
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
    marginBottom: 20,
    marginTop: 20,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
