import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import PageTop from "../../../../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DefaultButton from "../../../../../../../components/DefaultButton";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import CustomModal from "../../../../../../../components/popUps/CustomModal";
import { useAuth } from "../../../../../../../../contexts/AuthContext";
import apiUrl from "../../../../../../../utils/api_url.json";
import mqtt, { MqttClient } from "mqtt";
import { createMqttOptions } from "../../../../../../../utils/mqttOptions";

interface typePaymentKey {
  id: string;
  nomeChave: string;
  valor: string;
  recebedor: string;
}

const PagarComChave = () => {
  const [modalConfirmDataVisible, setModalConfirmDataVisible] = useState(false);
  const [paymentKeys, setPaymentKeys] = useState([]);
  const [valorPagamento, setValorPagamento] = useState("");
  const [emailDestinatario, setEmailDestinatario] = useState("");
  const [idKey, setIdKey] = useState("");
  const [fraseModal, setFraseModal] = useState("");
  const API_URL = apiUrl.apiUrl;
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());

  const { authState } = useAuth();

  const loggedEmail = authState?.loggedEmail;
  
  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getPaymentKeysResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getPaymentKeysResponse/${requestId.current}`
            );
          }
        }
      );
      client.current?.subscribe(
        `user/paymentWithKeyResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/paymentWithKeyResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      if (topic == `user/getPaymentKeysResponse/${requestId.current}`) {
        const formatedData = JSON.parse(message.toString());
        setPaymentKeys(formatedData.paymentKeys ?? []);
      }
      if (topic == `user/paymentWithKeyResponse/${requestId.current}`) {
        const formatedData = JSON.parse(message.toString());
        if (formatedData.message == "Operação concluída com sucesso!") {
          const chavesAtualizadas = paymentKeys.filter(
            (chave: any) => chave.id !== idKey
          );
          setPaymentKeys(chavesAtualizadas);
          window.alert(formatedData.message)
        }
      }
    });

    const payload = {
      email: loggedEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/getPaymentKeys", JSON.stringify(payload));
  }, []);

  const handlePagamento = async () => {
    const payload = {
      loggedEmail,
      emailDestinatario,
      valorPagamento: parseFloat(valorPagamento),
      idKey,
      requestId: requestId.current,
    };
    client.current?.publish("user/paymentWithKey", JSON.stringify(payload));

    setEmailDestinatario("");
    setValorPagamento("");
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="key" size={55} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          VOCÊ TEM OS SEGUINTES CÓDIGOS-CHAVE PENDENTES, SELECIONE UM E PAGUE:
        </Text>
      </View>

      {paymentKeys.length > 0 ? (
        <View style={styles.containerKeys}>
          {paymentKeys.map((i: typePaymentKey, index: number) => (
            <Pressable
              onPress={() => {
                setModalConfirmDataVisible(true);
                setFraseModal(
                  `Informações da chave de pagamento: \nDestinatario: ${i.recebedor} \nValor: E$${i.valor},00 \nConfirme para realizar o pagamento.`
                );
                setEmailDestinatario(i.recebedor);
                setValorPagamento(i.valor);
                setIdKey(i.id);
              }}
              style={styles.key}
              key={index}
            >
              <View>
                <Text style={styles.textKeys}>{i.nomeChave}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.containerTitle}>
          <Text style={styles.title}>
            Você não possui nenhuma chave de pagamento pendente.
          </Text>
        </View>
      )}

      <View style={styles.containerButton}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>

      <CustomModal
        visible={modalConfirmDataVisible}
        onClose={() => setModalConfirmDataVisible(false)}
        message={fraseModal}
        showInput={false}
        onConfirm={() => {
          handlePagamento();
          setModalConfirmDataVisible(false);
        }}
        confirmButtonText="Confirmar"
      />
    </ScrollView>
  );
};

export default PagarComChave;

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
  containerButton: {
    width: "70%",
    margin: "auto",
  },
});
