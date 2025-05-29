import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import React from "react";
import PageTop from "../../../../../../components/PageTop";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DefaultButton from "../../../../../../components/DefaultButton";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../../contexts/AuthContext";
import apiUrl from "../../../../../../utils/api_url.json";
import axios from "axios";

const Extrato = () => {
  const API_URL = apiUrl.apiUrl;
  const [showSaldoEcoCoin, setShowSaldoEcoCoin] = useState(false);
  const [showPagamentos, setShowPagamentos] = useState(false);
  const [showRecebimentos, setShowRecebimentos] = useState(false);
  const [showDefaultScreen, setShowDefaultScreen] = useState(true);
  const [saldoEcoCoins, setSaldoEcoCoins] = useState("");
  const { authState } = useAuth();
  const loggedEmail = authState?.loggedEmail;

  const [pagamentos, setPagamentos] = useState([]);

  const [recebimentos, setRecebimentos] = useState([]);

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

    console.log(filterRecebimentos)
    setPagamentos(filterPagamentos);
    setRecebimentos(filterRecebimentos);
    setSaldoEcoCoins(response.data.saldoEcoCoins)
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="bank" size={55} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>CLIQUE PARA VER SUAS TRANSAÇÕES</Text>
      </View>

      {showDefaultScreen ? (
        <View>
          <View style={styles.containerKeys}>
            <Pressable
              onPress={() => {
                setShowPagamentos(true);
                setShowDefaultScreen(false);
              }}
              style={styles.key}
            >
              <View>
                <Text style={styles.textKeys}>Ver meus pagamentos</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowRecebimentos(true);
                setShowDefaultScreen(false);
              }}
              style={styles.key}
            >
              <View>
                <Text style={styles.textKeys}>Ver pagamentos recebidos</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowSaldoEcoCoin(true);
                setShowDefaultScreen(false);
              }}
              style={styles.key}
            >
              <View>
                <Text style={styles.textKeys}>Ver meu saldo de EcoCoins</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.containerButton}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => router.back()}
            />
          </View>
        </View>
      ) : (
        <View></View>
      )}

      {showPagamentos ? (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>SEUS PAGAMENTOS:</Text>
          </View>

          {pagamentos.length > 0 ? (
            <View>
              {pagamentos.map((i: any, index) => (
                <View key={index} style={styles.containerInfos}>
                  <Text style={styles.textInfos}>
                    QUEM RECEBEU: {i.partner}
                  </Text>
                  <Text style={styles.textInfos}>VALOR: E${i.value},00</Text>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text style={styles.title}>
                Você não possui nenhum pagamento.
              </Text>
            </View>
          )}

          <View style={styles.containerButton}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => {
                setShowPagamentos(!showPagamentos);
                setShowDefaultScreen(!showDefaultScreen);
              }}
            />
          </View>
        </View>
      ) : (
        <View></View>
      )}

      {showRecebimentos ? (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>SEUS RECEBIMENTOS:</Text>
          </View>

          {recebimentos.length > 0 ? (
            <View>
              {recebimentos.map((i: any, index) => (
                <View key={index} style={styles.containerInfos}>
                  <Text style={styles.textInfos}>Pagador: {i.partner}</Text>
                  <Text style={styles.textInfos}>Valor: E${i.value},00</Text>
                  
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text style={styles.title}>
                Você não possui nenhum recebimento
              </Text>
            </View>
          )}

          <View style={styles.containerButton}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => {
                setShowRecebimentos(!showRecebimentos);
                setShowDefaultScreen(!showDefaultScreen);
              }}
            />
          </View>
        </View>
      ) : (
        <View></View>
      )}

      {showSaldoEcoCoin ? (
        <View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>SEU SALDO DE ECOCOINS É:</Text>
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>E${saldoEcoCoins},00</Text>
          </View>
          <View style={styles.containerButton}>
            <DefaultButton
              text={"Voltar"}
              onPressButton={() => {
                setShowSaldoEcoCoin(!showSaldoEcoCoin);
                setShowDefaultScreen(!showDefaultScreen);
              }}
            />
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

export default Extrato;

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
    paddingBottom: 20,
    paddingTop: 20,
  },
  containerInfos: {
    backgroundColor: "#0fa05f",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    width: "90%",
    margin: "auto",
    borderRadius: 20,
    borderWidth: 8,
    borderColor: "#d7f3f3",
    marginTop: 20,
  },
  textInfos: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    padding: 10,
  },
});
