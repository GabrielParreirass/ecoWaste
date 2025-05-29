import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import PageTop from "../../../../../../components/PageTop";
import DefaultButton from "../../../../../../components/DefaultButton";
import { router } from "expo-router";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomModal from "../../../../../../components/popUps/CustomModal";
import { useAuth } from "../../../../../../contexts/AuthContext";
import axios from "axios";
import apiUrl from "../../../../../../utils/api_url.json";

const CuponsDisponiveis = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const API_URL = apiUrl.apiUrl;
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;
  const [cupponName, setCupponName] = useState("");
  const [cupponValue, setCupponValue] = useState("");

  const addCupon = async () => {
    const response = await axios.post(`${API_URL}/addCupon`, {
      loggedEmail,
      cupponName,
      cupponValue,
    });
    alert(response.data.message);
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <MaterialIcons name="discount" size={60} color="green" />
        </View>
      </View>

      <View>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>
            Seus EcoCoins podem te garantir descontos em estabelecimentos
            conveniados! Consulte os cupons disponíveis:
          </Text>
        </View>
        <View style={styles.containerKeys}>
          <Pressable
            style={styles.key}
            onPress={() => {
              setTextoModal(
                "RECEBA 5% DE DESCONTO NA SUA PROXIMA COMPRA NO ALVORADA.  \nPREÇO DO CUPOM E$100"
              );
              setModalVisible(true);
              setCupponName("Alvorada");
              setCupponValue("5%");
            }}
          >
            <View>
              <Text style={styles.textKeys}>ALVORADA: 5% de desconto</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.key}
            onPress={() => {
              setTextoModal(
                "RECEBA 5% DE DESCONTO NA SUA PROXIMA COMPRA NO UNISUL.  \nPREÇO DO CUPOM E$100"
              );
              setModalVisible(true);
              setCupponName("Unisul");
              setCupponValue("5%");
            }}
          >
            <View>
              <Text style={styles.textKeys}>UNISUL: 5% de desconto</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.key}
            onPress={() => {
              setTextoModal(
                "RECEBA 10% DE DESCONTO NA SUA PROXIMA COMPRA NO MARISTELA.  \nPREÇO DO CUPOM E$100"
              );
              setModalVisible(true);
              setCupponName("Maristela");
              setCupponValue("10%");
            }}
          >
            <View>
              <Text style={styles.textKeys}>MARISTELA: 10% de desconto</Text>
            </View>
          </Pressable>
        </View>
        <View style={{ width: "70%", margin: "auto" }}>
          <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        message={textoModal}
        showInput={false}
        onConfirm={() => {
          setModalVisible(false);
          addCupon();
          setModalConfirmVisible(true);
        }}
      />
      {/* <CustomModal
        visible={modalConfirmVisible}
        onClose={() => {
          setModalConfirmVisible(false);
        }}
        message="PARABÉNS, O CUPOM FOI ADICIONADO À SUA CONTA."
        showInput={false}
        onConfirm={() => {
          setModalConfirmVisible(false);
          router.navigate(
            "/(private)/ecomorador/pages/beneficios/supermercado/meusCupons/page"
          );
        }}
        confirmButtonText="Ver meus cupons"
      /> */}
    </ScrollView>
  );
};

export default CuponsDisponiveis;

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
