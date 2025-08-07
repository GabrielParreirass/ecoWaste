import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import PageTop from "../../../../../../components/PageTop";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import DefaultButton from "../../../../../../components/DefaultButton";
import CustomModal from "../../../../../../components/popUps/CustomModal";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../../../utils/api_url.json";

const Receber = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [valor, setValor] = useState("");
  const [pagador, setPagador] = useState("");
  const [fraseModal, setFraseModal] = useState("");
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());
  const API_URL = apiUrl.apiUrl;

  useEffect(() => {
    client.current = mqtt.connect(API_URL);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/sendPaymentKeyResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/sendPaymentKeyResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedData = JSON.parse(message.toString());
      window.alert(formatedData.message)
    });
  }, []);

  const generateQRCode = (jsonData: string) => {
    try {
      const parsedJson = JSON.parse(jsonData);
      setQrValue(jsonData);
      setShowQrCode(true);
    } catch (error) {
      alert("Preencha todos os dados para gerar o QR CODE");
    }
    setPagador("");
    setValor("");
  };

  const handleSendPaymentKey = async () => {

    const payload = {
      devedor: pagador,
      valor: valor,
      recebedor: loggedEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/sendPaymentKey", JSON.stringify(payload));

    setPagador("");
    setValor("");
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <MaterialIcons name="payments" size={60} color="green" />
        </View>
      </View>

      {showQrCode ? (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>SEU QR CODE DE COBRANÇA:</Text>
          </View>
          <View style={{ display: "flex", alignItems: "center" }}>
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
              INSIRA O NOME DO USUÁRIO E O VALOR A SER COBRADO:
            </Text>
          </View>
          <View style={styles.containerInput}>
            <TextInput
              placeholder="Usuário"
              style={styles.input}
              value={pagador}
              onChangeText={setPagador}
            />
            <TextInput
              placeholder="Valor (E$)"
              style={styles.input}
              value={valor}
              onChangeText={setValor}
            />
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>COMO DESEJA COBRAR:</Text>
          </View>
          <View style={styles.containerIcons}>
            <Pressable
              onPress={() => {
                if (valor == "" || pagador == "") {
                  alert("Preencha os campos para gerar o QR CODE");
                  return;
                }
                const jsonData = `{"emailDevedor":"${pagador}", "valor":"${valor}", "emailRecebedor":"${loggedEmail}"}`;
                generateQRCode(jsonData);
              }}
            >
              <LinearGradient
                colors={["#0097b2", "#7ed957"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <MaterialIcons name="qr-code-2" size={80} color="white" />
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={() => {
                if (valor == "" || pagador == "") {
                  alert("Preencha os campos para gerar a CHAVE DE PAGAMENTO");
                  return;
                }
                setFraseModal(
                  `Sua chave de cobrança é: ${loggedEmail}\nEla será enviada para: ${pagador}\nNo valor de: E$${valor},00`
                );
                setModalVisible(true);
              }}
            >
              <LinearGradient
                colors={["#0097b2", "#7ed957"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <FontAwesome5 name="key" size={80} color="white" />
              </LinearGradient>
            </Pressable>
          </View>
          <View
            style={{
              width: "70%",
              margin: "auto",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => router.back()}
            />
          </View>
        </View>
      )}

      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        message={fraseModal}
        showInput={false}
        onConfirm={() => {
          handleSendPaymentKey();
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
};

export default Receber;

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
    fontSize: 17,
  },
  containerInput: {
    padding: 30,
  },
  input: {
    borderBottomColor: "#0fa05f",
    borderBottomWidth: 2,
    borderStyle: "dashed",
    marginTop: 5,
  },
  containerIcons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    marginBottom: 10,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    maxWidth: 150,
  },
});
