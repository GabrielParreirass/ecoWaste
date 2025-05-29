import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PageTop from "../../../../../components/PageTop";
import DefaultButton from "../../../../../components/DefaultButton";
import CustomModal from "../../../../../components/popUps/CustomModal";
import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";
import apiUrl from "../../../../../utils/api_url.json";
import { useAuth } from "../../../../../contexts/AuthContext";

const BoasCausas = () => {
  const [modalMsgAgradecimentoVisible, setModalMsgAgradecimentoVisible] =
    useState(false);
  const API_URL = apiUrl.apiUrl;
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;
  const [valorPagamento, setValorPagamento] = useState("");

  const handlePagamento = async () => {
    const response = await axios.post(`${API_URL}/payments`, {
      loggedEmail,
      emailDestinatario: "asildodesantarita@gmail.com",
      valorPagamento,
    });

    window.alert(response.data.message);

    setValorPagamento("");
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="hand-holding-heart" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>AJUDE O ASILO DE SANTA RITA:</Text>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Esse valor será revertido em produtos (alimentos, higiene pessoal,
          etc.) pelos nossos parceiros.
        </Text>
      </View>
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Valor (E$)"
          style={styles.input}
          onChangeText={(e) => setValorPagamento(e)}
          value={valorPagamento}
        />
      </View>
      <View style={styles.containerDefaultButton}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
        <DefaultButton
          text={"Confirmar"}
          onPressButton={() => {
            handlePagamento();
            setModalMsgAgradecimentoVisible(true);
          }}
        />
      </View>

      <CustomModal
        visible={modalMsgAgradecimentoVisible}
        onClose={() => setModalMsgAgradecimentoVisible(false)}
        message="O asilo de Santa Rita do Sapucaí agradece sua doação!"
        showInput={false}
        onConfirm={() => {
          setModalMsgAgradecimentoVisible(false);
        }}
        confirmButtonText="Confirmar"
      />
    </ScrollView>
  );
};

export default BoasCausas;

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
  containerSaldo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  saldo: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: 20,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
});
