import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import PageTop from "../../../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DefaultButton from "../../../../../../components/DefaultButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import CustomModal from "../../../../../../components/popUps/CustomModal";
import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import apiUrl from "../../../../../../utils/api_url.json";
import { useAuth } from "../../../../../../contexts/AuthContext";
import QRCodeScanner from "../../../../../../components/QrCodeReader";

const Pagar = () => {
  const API_URL = apiUrl.apiUrl;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmDataVisible, setModalConfirmDataVisible] = useState(false);
  const [emailDestinatario, setEmailDestinatario] = useState("");
  const [valorPagamento, setValorPagamento] = useState("");
  const [showQrCodeScanner, setShowQrCodeScanner] = useState(false);
  const [messageConfirmacaoModal, setMessageConfirmacaoModal] = useState("");
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;

  const handlePagamento = async () => {
    const response = await axios.post(`${API_URL}/payments`, {
      loggedEmail,
      emailDestinatario,
      valorPagamento,
    });

    window.alert(response.data.message);

    setEmailDestinatario("");
    setValorPagamento("");
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="money-bill-alt" size={55} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          INSIRA O EMAIL DO USUÁRIO E O VALOR DO PAGAMENTO:
        </Text>
      </View>
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Email do destinatário"
          style={styles.input}
          onChangeText={(e) => setEmailDestinatario(e)}
          value={emailDestinatario}
        />
        <TextInput
          placeholder="Valor (E$)"
          style={styles.input}
          onChangeText={(e) => setValorPagamento(e)}
          value={valorPagamento}
        />
      </View>
      <Pressable style={styles.containerDefaultButton}>
        <DefaultButton text={"Pagar"} onPressButton={() => handlePagamento()} />
      </Pressable>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          VOCÊ TAMBÉM PODE PAGAR POR QR CODE OU CÓDIGO CHAVE:
        </Text>
      </View>
      <View style={styles.containerIcons}>
        <Pressable onPress={() => setModalVisible(true)}>
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
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/ecocoins/transferirReceber/pagar/pagarComChave/page"
            )
          }
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

      {showQrCodeScanner && (
        <View style={StyleSheet.absoluteFillObject}>
          <QRCodeScanner
            onScan={(data: any) => {
              console.log("QR code lido:", data);
              const formatedData = JSON.parse(data);
              setShowQrCodeScanner(false);
              setMessageConfirmacaoModal(
                `Confira as informações de pagamento:\nDestinatário: ${formatedData.emailRecebedor}\nValor(E$): ${formatedData.valor},00 \nConfirme sua transação!`
              );
              setValorPagamento(formatedData.valor);
              setEmailDestinatario(formatedData.emailRecebedor);
              setModalConfirmDataVisible(true);
            }}
          />
        </View>
      )}

      <View style={{ width: "70%", margin: "auto", paddingBottom: 10 }}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        message="Aponte sua camera para o QR Code para efetuar o pagamento!"
        showInput={false}
        onConfirm={() => {
          setShowQrCodeScanner(true);
          setModalVisible(false);
        }}
        confirmButtonText="Escanear"
      />

      <CustomModal
        visible={modalConfirmDataVisible}
        onClose={() => setModalConfirmDataVisible(false)}
        message={messageConfirmacaoModal}
        showInput={false}
        onConfirm={() => {
          setModalConfirmDataVisible(false);
          handlePagamento();
        }}
        confirmButtonText="Confirmar"
      />
    </ScrollView>
  );
};

export default Pagar;

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
  containerDefaultButton: {
    width: "70%",
    margin: "auto",
    marginBottom: 10,
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
