import { View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PageTop from "../../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Etapa1 from "./etapas/etapa1";
import Etapa2 from "./etapas/etapa2";
import Etapa3 from "./etapas/etapa3";
import Etapa4 from "./etapas/etapa4";
import Etapa5 from "./etapas/etapa5";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../../utils/api_url.json";
import * as Location from "expo-location";
import { LocationObjectCoords } from "expo-location";


const NovaColeta = () => {
  const [progression, setProgression] = useState("1");
  const [tipo, setTipo] = useState("");
  const [peso, setPeso] = useState("");
  const [diaSem, setDiaSem] = useState("");
  const [horario, setHorario] = useState("");
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const API_URL = apiUrl.apiUrl;

  const { authState } = useAuth();

  const loggedEmail = authState?.loggedEmail;

  const [inputValue, setInputValue] = useState("");

  const client = useRef<MqttClient | null>(null);

 const requestId = useRef(Date.now().toString());


  useEffect(() => {
    client.current = mqtt.connect(API_URL);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/agendarColetaResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/agendarColetaResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedMessage = JSON.parse(message.toString())
      alert(formatedMessage.message)
    });

    (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissão de localização negada");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  })();

    return () => {
      client.current?.end();
    };
  }, []);

  const handleSendColeta = async () => {
    const payload = {
      email: loggedEmail,
      tipo,
      peso,
      diaSem,
      horario,
      requestId: requestId.current,
      latitude: location?.latitude.toString(),
      longitude: location?.longitude.toString()
    };

    console.log('RequestId 2: ', requestId.current)
    client.current?.publish("user/agendarColeta", JSON.stringify(payload));


    console.log("Mandou a coleta")

  };

  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="trash-restore" size={60} color="green" />
        </View>
      </View>
      {progression == "1" ? (
        <Etapa1
          setInputValue={setInputValue}
          inputValue={inputValue}
          onConfirm={(value) => {
            setTipo(value);
            setProgression("2");
          }}
        />
      ) : (
        <View></View>
      )}
      {progression == "2" ? (
        <Etapa2
          setInputValue={setInputValue}
          inputValue={inputValue}
          onConfirm={(value) => {
            setPeso(value);
            setProgression("3");
          }}
        />
      ) : (
        <View></View>
      )}
      {progression == "3" ? (
        <Etapa3
          setInputValue={setInputValue}
          inputValue={inputValue}
          onConfirm={(value) => {
            setDiaSem(value);
            setProgression("4");
          }}
        />
      ) : (
        <View></View>
      )}
      {progression == "4" ? (
        <Etapa4
          setInputValue={setInputValue}
          inputValue={inputValue}
          onConfirm={(value) => {
            setHorario(value);
            setProgression("5");
          }}
        />
      ) : (
        <View></View>
      )}
      {progression == "5" ? (
        <Etapa5
          setInputValue={setInputValue}
          inputValue={inputValue}
          onConfirm={() => {
            handleSendColeta();
            setProgression("1");
          }}
        />
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

export default NovaColeta;

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
    textAlign: "center",
    padding: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  mainContainerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    gap: 20,
    marginTop: 20,
    padding: 10,
  },
  subContainerCards: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    gap: 20,
  },
  card: {
    width: "25%",
  },
});
