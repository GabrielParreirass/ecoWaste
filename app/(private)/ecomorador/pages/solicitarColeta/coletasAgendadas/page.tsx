import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PageTop from "../../../../../components/PageTop";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

interface tiposColeta {
  status: String;
  coletor: String;
  quantidade: String;
  dia: String;
  horario: String;
  expira: String;
}

const ColetasAgendadas = () => {
  const [residuos, setResiduos] = useState<any>([]);
  const [entulho, setEntulhos] = useState<any>([]);
  const [showResiduos, setShowResiduos] = useState(false);
  const [showEntulhos, setShowEntulhos] = useState(false);

  useEffect(() => {
    setResiduos([
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
    ]);
    setEntulhos([
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
      {
        status:"Postada",
        coletor:"Gabriel Parreiras",
        quantidade: 5,
        dia: "quinta-feira",
        horario: "16h30",
        expira: "21/05/2025",
      },
    ]);
  }, []);

  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="calendar-alt" size={60} color="green" />
        </View>
      </View>

      {showEntulhos || showResiduos ? (
        <View>
          {showEntulhos ? (
            <ScrollView>
              <View style={styles.containerMainInfos}>
                {entulho.map((i: tiposColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>
                      Status: {i.status}
                    </Text>
                    <Text style={styles.textInfos}>
                      Coletor: {i.coletor}
                    </Text>
                    <Text style={styles.textInfos}>
                      Quantidade: {i.quantidade}kg
                    </Text>
                    <Text style={styles.textInfos}>
                      Dia/horário: {i.dia} / {i.horario}
                    </Text>
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
                {residuos.map((i: tiposColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>
                      Status: {i.status}
                    </Text>
                    <Text style={styles.textInfos}>
                      Coletor: {i.coletor}
                    </Text>
                    <Text style={styles.textInfos}>
                      Quantidade: {i.quantidade}kg
                    </Text>
                    <Text style={styles.textInfos}>
                      Dia/horário: {i.dia} / {i.horario}
                    </Text>
                    <Text style={styles.textInfos}>Expira em: {i.expira}</Text>
                  </View>
                ))}
                <Pressable
                  onPress={() => setShowResiduos(!showResiduos)}
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
              Aqui estão suas solicitações de coleta agendadas. Clique para
              detalhes
            </Text>
          </View>
          <View style={styles.containerButtons}>
            <Pressable
              style={styles.button}
              onPress={() => setShowResiduos(!showResiduos)}
            >
              <Text style={styles.textButton}>Resíduo Orgânico</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => setShowEntulhos(!showEntulhos)}
            >
              <Text style={styles.textButton}>Entulho</Text>
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

export default ColetasAgendadas;

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
