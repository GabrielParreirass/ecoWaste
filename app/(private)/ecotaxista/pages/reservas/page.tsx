import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import PageTop from "../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DefaultButton from "../../../../components/DefaultButton";
import { router } from "expo-router";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../utils/api_url.json";
import CustomModal from "../../../../components/popUps/CustomModal";
import QRCodeScanner from "../../../../components/QrCodeReader";
import { createMqttOptions } from "../../../../utils/mqttOptions";

const Reservas = () => {
  const API_URL = apiUrl.apiUrl;
  const client = useRef<MqttClient | null>(null);
  const { authState } = useAuth();
  const userEmail = authState?.loggedEmail;

  const requestId = useRef(Date.now().toString());

  const [coletas, setColetas] = useState({ coletas: [] });
  const [selectedColeta, setSelectedColeta] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] =
    useState<boolean>(false);
  const [showQrCodeScanner, setShowQrCodeScanner] = useState(false);
  const [lixeiraVazia, setLixeiraVazia] = useState(false);
  const [trancada, setTrancada] = useState(true)

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getColetasReservadasResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getColetasReservadasResponse/${requestId.current}`
            );
          }
        }
      );

      client.current?.subscribe(`EcoWaste/ultrassom`, (err) => {
        if (!err) {
          console.log(`📡 Inscrito no tópico EcoWaste/ultrassom`);
        }
      });

      client.current?.subscribe(`EcoWaste/tranca`, (err) => {
        if (!err) {
          console.log(`📡 Inscrito no tópico EcoWaste/tranca`);
        }
      });
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);

      if (topic == `user/getColetasReservadasResponse/${requestId.current}`) {
        const formatedColetas = JSON.parse(message.toString());
        setColetas(formatedColetas);
      }

      if(topic == "EcoWaste/ultrassom"){
        const formatedMessage = JSON.parse(message.toString());
        console.log(formatedMessage)
        if(formatedMessage.nivel == 3){
          console.log("setando o true")
          setLixeiraVazia(true)
        }
      }

      if(topic == "EcoWaste/tranca"){
        if(message.toString() == "1"){
          setTrancada(true)
        }else{
          client.current?.publish("EcoWaste/destrancar", "0")
          setTrancada(false)
        }
        console.log(trancada)
      }
    });

    


    const payload = {
      email: userEmail,
      requestId: requestId.current,
    };
    client.current?.publish(
      "user/getColetasReservadas",
      JSON.stringify(payload)
    );


    return () =>{
      client.current?.unsubscribe("EcoWaste/tranca")
    }
  }, []);

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="calendar-check" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Eco Lixeiras reservadas, clique para detalhes:
        </Text>
      </View>

      <View style={styles.containerKeys}>
        {coletas.coletas.map((i: any, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => (setSelectedColeta(i), setModalVisible(true))}
            style={styles.key}
            key={index}
          >
            <View>
              <Text style={styles.textKeys}>
                {i.type}: {i.peso}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ width: "70%", margin: "auto" }}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>

      {showQrCodeScanner && (
        <View style={StyleSheet.absoluteFillObject}>
          <QRCodeScanner
            onScan={(data: any) => {
              console.log("QR code lido:", data);
              setShowQrCodeScanner(false);
              console.log(data);
              client.current?.publish("EcoWaste/destrancar", "1");
              setModalConfirmacaoVisible(true);
            }}
          />
        </View>
      )}

      {selectedColeta && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={`Material selecionado: ${selectedColeta.type} \n Quantidade: ${selectedColeta.peso} \n Horario: ${selectedColeta.horario} \n Dia da semana: ${selectedColeta.dia}`}
          showInput={false}
          confirmButtonText="Destrancar"
          onConfirm={() => {
            setShowQrCodeScanner(true);
            setModalVisible(false);
          }}
        />
      )}

      <CustomModal
        visible={modalConfirmacaoVisible}
        onClose={() => setModalConfirmacaoVisible(false)}
        message={`Para concluir sua coleta, certifique-se que: \n - A lixeira esta vazia \n - A lixeira sera trancada automaticamente apos o fechamento da porta`}
        showInput={false}
        confirmButtonText="Confirmar"
        onConfirm={() => {
          console.log(lixeiraVazia)
          if(lixeiraVazia && trancada){
            setModalConfirmacaoVisible(false);
            window.alert("Coleta confirmada com sucesso")
          }else{
            window.alert("Lixeira continua cheia!")
          }
        }}
      />
    </ScrollView>
  );
};

export default Reservas;

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
