import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useRef } from "react";
import PageTop from "../../../../../../components/PageTop";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DefaultButton from "../../../../../../components/DefaultButton";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import apiUrl from "../../../../../../utils/api_url.json";
import QRCode from "react-native-qrcode-svg";
import mqtt, { MqttClient } from "mqtt";

const MeusCupons = () => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [cupons, setCupons] = useState([]);
  const [qrValue, setQrValue] = useState("");
  const API_URL = apiUrl.apiUrl;
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;

  const client = useRef<MqttClient | null>(null);

  const requestId = useRef(Date.now().toString());

  useEffect(() => {
    client.current = mqtt.connect(API_URL);

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
      setCupons(formatedData.user.cupons)
    });

    const payload = {
      email: loggedEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/getUserData", JSON.stringify(payload));
  }, []);

  // const fetchData = async () => {
  //   const response = await axios.post(`${API_URL}/getUserData`, {
  //     loggedEmail,
  //   });

  //   setCupons(response.data.cupons);
  // };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome name="shopping-bag" size={60} color="green" />
        </View>
      </View>
      {showQrCode ? (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>SEU QR CODE DE DESCONTO:</Text>
          </View>
          <View style={{ display: "flex", alignItems: "center", padding: 10 }}>
            <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
            />
          </View>
          <View style={{ width: "70%", margin: "auto" }}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => setShowQrCode(false)}
            />
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>
              Veja abaixo seus cupons, para usá-los, selecione um:
            </Text>
          </View>
          <View style={styles.containerKeys}>
            {cupons.map((i: any) => (
              <Pressable
                style={styles.key}
                onPress={() => {
                  const formatedId = i.id.toString();
                  setQrValue(formatedId);
                  setShowQrCode(true);
                }}
                key={i.id}
              >
                <View>
                  <Text style={styles.textKeys}>
                    {i.name} | {i.value} de desconto
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
          <View style={{ width: "70%", margin: "auto" }}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => router.back()}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MeusCupons;

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
  containerKeys: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    marginBottom: 30,
  },
  key: {
    padding: 15,
    backgroundColor: "#096600",
    width: "70%",
    borderRadius: 15,
  },
  textKeys: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
