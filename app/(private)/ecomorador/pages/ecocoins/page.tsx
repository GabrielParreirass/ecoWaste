import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import PageTop from "../../../../components/PageTop";
import Entypo from "@expo/vector-icons/Entypo";
import DefaultButton from "../../../../components/DefaultButton";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from "axios";
import apiUrl from "../../../../utils/api_url.json";
import { useAuth } from "../../../../contexts/AuthContext";

const EcoCoins = () => {
  const API_URL = apiUrl.apiUrl;
  const [saldoEcoCoins, setSaldoEcoCoins] = useState("");
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.post(`${API_URL}/fetchPaymentData`, {
      email: loggedEmail,
    });
    const filterPagamentos = response.data.transacoes.filter(
      (i: any) => i.type == "Pagamento"
    );
    const filterRecebimentos = response.data.transacoes.filter(
      (i: any) => i.type == "Recebimento"
    );
    
    setSaldoEcoCoins(response.data.saldoEcoCoins);
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Entypo name="wallet" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Vai um dinheirinho ai!? Aqui seus resíduos valem ouro, ou melhor,
          ecocoins! Veja seu saldo, faça pagamentos para amigos e muito mais.
        </Text>
      </View>
      <View style={styles.containerSaldo}>
        <Text style={styles.saldo}>Saldo atual (E$): {saldoEcoCoins},00</Text>
      </View>
      <View style={styles.containerBtns}>
        <Pressable
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/ecocoins/transferirReceber/page"
            )
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <FontAwesome6 name="money-bill-transfer" size={80} color="white" />
            <Text style={styles.textButton}>Transferir / Receber</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={() =>
            router.navigate(
              "/(private)/ecomorador/pages/ecocoins/boasCausas/page"
            )
          }
        >
          <LinearGradient
            colors={["#0097b2", "#7ed957"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <FontAwesome5 name="hand-holding-heart" size={80} color="white" />
            <Text style={styles.textButton}>Apoiar Boas Causas</Text>
          </LinearGradient>
        </Pressable>
      </View>
      <View style={styles.containerDefaultButton}>
        <DefaultButton text={"sair"} onPressButton={() => router.back()} />
      </View>
    </ScrollView>
  );
};

export default EcoCoins;

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
  containerBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 30,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    maxWidth: 150,
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  containerDefaultButton: {
    width: "80%",
    margin: "auto",
  },
});
