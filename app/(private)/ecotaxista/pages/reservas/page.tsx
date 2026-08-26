import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
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
  const [showQrCodeScanner2, setShowQrCodeScanner2] = useState(false);
  const [lixeiraVazia, setLixeiraVazia] = useState(false);
  const [trancada, setTrancada] = useState(true);

  const options = createMqttOptions();

  const abrirMapa = (lat: number, lng: number) => {
    if (!lat || !lng) {
      window.alert("Coordenadas não disponíveis para esta lixeira.");
      return;
    }
    // URL universal do Google Maps para marcação de rota
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        window.alert("Não foi possível abrir o mapa.");
      }
    });
  };

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getColetasReservadasResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getColetasReservadasResponse/${requestId.current}`,
            );
          }
        },
      );

      client.current?.subscribe(
        `user/confirmarColetaResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/confirmarColetaResponse/${requestId.current}`,
            );
          }
        },
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

      if (topic == "EcoWaste/ultrassom") {
        const formatedMessage = JSON.parse(message.toString());
        console.log(formatedMessage);
        if (formatedMessage == "3") {
          setLixeiraVazia(true);
        }
      }

      if (topic == `user/confirmarColetaResponse/${requestId.current}`) {
        console.log(
          "✅ Coleta confirmada pelo servidor! Atualizando a lista...",
        );

        const payload = {
          email: userEmail,
          requestId: requestId.current,
        };
        client.current?.publish(
          "user/getColetasReservadas",
          JSON.stringify(payload),
        );
      }

      if (topic == "EcoWaste/tranca") {
        if (message.toString() == "1") {
          setTrancada(true);
        } else {
          setTrancada(false);
        }
        console.log(trancada);
      }
    });

    const payload = {
      email: userEmail,
      requestId: requestId.current,
    };
    client.current?.publish(
      "user/getColetasReservadas",
      JSON.stringify(payload),
    );

    return () => {
      client.current?.unsubscribe("EcoWaste/tranca");
    };
  }, []);

  const confirmarColeta = () => {
    console.log("Confirmando coleta com ID:", selectedColeta.id);
    client.current?.publish("EcoWaste/destrancar", "0");
    const payload = {
      coletaId: selectedColeta.id,
      requestId: requestId.current,
    };
    client.current?.publish("user/confirmarColeta", JSON.stringify(payload));
  };

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#F4D03F",
                borderRadius: 3,
              }}
            />
            <Text style={{ color: "black", fontSize: 13 }}>
              Coletas de encontro
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#096600",
                borderRadius: 3,
              }}
            />
            <Text style={{ color: "black", fontSize: 13 }}>
              Coletas de lixeira
            </Text>
          </View>
        </View>
        <View>
            <Text>{lixeiraVazia ? "Lixeira vazia" : "Lixeira cheia"}</Text>
            <Text>{trancada ? "Lixeira trancada" : "Lixeira destrancada"}</Text>
          </View>
      </View>

      <View style={styles.containerKeys}>
        {coletas.coletas.map((i: any, index) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => (setSelectedColeta(i), setModalVisible(true))}
            style={[
              styles.key,
              { backgroundColor: i.lixeiraId ? "#096600" : "#F4D03F" },
            ]}
            key={index}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.textKeys,

                  { color: i.lixeiraId ? "#F4D03F" : "#096600" },
                ]}
              >
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

      {showQrCodeScanner2 && (
        <View style={StyleSheet.absoluteFillObject}>
          <QRCodeScanner
            onScan={(data: any) => {
              console.log("QR code lido:", data);
              setShowQrCodeScanner2(false);
              console.log(data);
              if (data == selectedColeta.usersId) {
                alert("Coleta confirmada!");
                confirmarColeta();
              } else {
                alert("Coleta não pertence ao usuario, tente novamente");
              }
            }}
          />
        </View>
      )}

      {selectedColeta && (
        <View>
          {selectedColeta.lixeiraId ? (
            <CustomModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              message={`Material selecionado: ${selectedColeta.type} \n Quantidade: ${selectedColeta.peso} \n Horario: ${selectedColeta.horario} \n Dia da semana: ${selectedColeta.dia}`}
              showInput={false}
              onMapPress={() =>
                abrirMapa(selectedColeta.latitude, selectedColeta.longitude)
              }
              confirmButtonText="Destrancar"
              onConfirm={() => {
                setShowQrCodeScanner(true);
                setModalVisible(false);
              }}
            />
          ) : (
            <CustomModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              message={`Material selecionado: ${selectedColeta.type} \n Quantidade: ${selectedColeta.peso} \n Horario: ${selectedColeta.horario} \n Dia da semana: ${selectedColeta.dia}`}
              onMapPress={() =>
                abrirMapa(selectedColeta.latitude, selectedColeta.longitude)
              }
              showInput={false}
              confirmButtonText="Escanear Qr Code do usuario"
              stackedButtons={true}
              onConfirm={() => {
                setShowQrCodeScanner2(true);
                setModalVisible(false);
              }}
            />
          )}
        </View>
      )}

      <CustomModal
        visible={modalConfirmacaoVisible}
        onClose={() => setModalConfirmacaoVisible(false)}
        message={`Para concluir sua coleta, certifique-se que: \n - A lixeira esta vazia`}
        showInput={false}
        confirmButtonText="Confirmar e trancar"
        stackedButtons={true}
        onConfirm={() => {
          client.current?.publish("EcoWaste/destrancar", "0");
          setTrancada(true);
          if (lixeiraVazia && trancada) {
            setModalConfirmacaoVisible(false);
            window.alert("Coleta confirmada com sucesso");
            confirmarColeta();
          } else {
            if (!lixeiraVazia) {
              window.alert("Lixeira continua cheia!");
            } else if (!trancada) {
              window.alert("Lixeira continua aberta!");
            } else {
              window.alert("Lixeira continua cheia e aberta!");
            }
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
    borderRadius: 50,
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
    padding: 20,
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
