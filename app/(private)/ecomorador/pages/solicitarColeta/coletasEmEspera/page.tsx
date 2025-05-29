import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PageTop from "../../../../../components/PageTop";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "../../../../../contexts/AuthContext";
import apiUrl from "../../../../../utils/api_url.json";
import axios from "axios";
import mqtt, { MqttClient } from "mqtt";

interface tipoColeta {
  peso: String;
  dia: String;
  horario: String;
  type: String;
  expira: String;
}

const ColetasEmEspera = () => {
  const API_URL = apiUrl.apiUrl;

  const [showEntulhos, setShowEntulhos] = useState(false);
  const [showResiduos, setShowResiduos] = useState(false);
  const [coletas, setColetas] = useState([]);
  const [filteredColetas, setFilteredColetas] = useState([]);

  useEffect(() => {
    fetchColetas();
  }, []);

  const { authState } = useAuth();

  const userEmail = authState?.loggedEmail;

  const fetchColetas = async () => {
    try {
      const response = await axios.post(`${API_URL}/getColetas`, {
        email: userEmail,
      });
      console.log(response.data.coletas);
      setColetas(response.data.coletas);
    } catch (e) {
      console.log(e);
    }
  };

  const setFilterColetas = (type: string) => {
    if (type === "Todos") {
      setFilteredColetas(coletas);
    } else {
      const filtered = coletas.filter((i: tipoColeta) => i.type === type);
      setFilteredColetas(filtered);
    }
  };

  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Ionicons name="time-outline" size={60} color="green" />
        </View>
      </View>

      {showEntulhos || showResiduos ? (
        <View>
          {showEntulhos ? (
            <ScrollView>
              <View style={styles.containerMainInfos}>
                {filteredColetas.map((i: tipoColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>Tipo: {i.dia}</Text>
                    <Text style={styles.textInfos}>Quantidade: {i.peso}</Text>
                    <Text style={styles.textInfos}>Dia: {i.dia}</Text>
                    <Text style={styles.textInfos}>Horário: {i.horario}</Text>
                    <Text style={styles.textInfos}>Expira em: {i.expira}</Text>
                  </View>
                ))}

                <Pressable
                  onPress={() => setShowEntulhos(!showEntulhos)}
                  style={styles.button3}
                >
                  <Text style={styles.textButton}>Fechar</Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : (
            <ScrollView>
              <View style={styles.containerMainInfos}>
                {filteredColetas.map((i: tipoColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>Tipo: {i.type}</Text>
                    <Text style={styles.textInfos}>Quantidade: {i.peso}</Text>
                    <Text style={styles.textInfos}>Dia: {i.dia}</Text>
                    <Text style={styles.textInfos}>Horário: {i.horario}</Text>
                    <Text style={styles.textInfos}>Expira em: {i.expira}</Text>
                  </View>
                ))}
                <Pressable
                  onPress={() => {
                    setFilterColetas("Papel");
                    setShowResiduos(!showResiduos);
                  }}
                  style={styles.button3}
                >
                  <Text style={styles.textButton}>Fechar</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      ) : (
        <>
          <View>
            <Text style={styles.title}>
              Aqui estão suas solicitações de coleta. Clique para detalhes
            </Text>
          </View>
          <View style={styles.containerButtons}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Todos");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Todos</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Papel");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Papel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Plastico");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Plástico</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Vidro");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Vidro</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Metal");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Metal</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Organico");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Resíduo Orgânico</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setFilterColetas("Entulhos");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Entulhos</Text>
            </Pressable>
          </View>
          <View style={styles.containerButtons}>
            <Pressable style={styles.button2} onPress={() => router.back()}>
              <Text style={styles.textButton}>Voltar</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ColetasEmEspera;

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
    padding: 20,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#0fa05f",
    fontWeight: "bold",
  },
  containerButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0fa05f",
    width: "70%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    margin: 10,
    padding: 15,
    borderRadius: 20,
  },
  button2: {
    backgroundColor: "#0fa05f",
    marginTop: 80,
    width: "30%",
    display: "flex",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
  },
  button3: {
    backgroundColor: "#0fa05f",
    marginTop: 30,
    marginBottom: 30,
    width: "30%",
    display: "flex",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
  },

  textButton: {
    color: "white",
  },
  containerMainInfos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    textTransform: "uppercase",
    margin: 10,
  },
});
