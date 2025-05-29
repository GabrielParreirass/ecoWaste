import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import CardNovaColeta from "../../../../../../components/CardNovaColeta";
import DefaultButton from "../../../../../../components/DefaultButton";
import EtapasProps from "../../../../../../types/EtapasProps";
import { router } from "expo-router";

const Etapa1 = ({inputValue, setInputValue, onConfirm}: EtapasProps) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>
          Vamos realizar sua solicitação de coleta, o que deseja reciclar?
        </Text>
      </View>
      <View style={styles.mainContainerCards}>
        <View style={styles.subContainerCards}>
          <CardNovaColeta text="Papel" background="blue" onPressCard={() => onConfirm!("Papel")} />
          <CardNovaColeta text="Metal" background="#ffb800" onPressCard={() => onConfirm!("Metal")}/>
        </View>
        <View style={styles.subContainerCards}>
          <CardNovaColeta text="Plástico" background="red" onPressCard={() => onConfirm!("Plastico")}/>
          <CardNovaColeta text="Orgânicos" background="brown" onPressCard={() => onConfirm!("Organico")} />
        </View>
        <View style={styles.subContainerCards}>
          <CardNovaColeta text="Vidro" background="green" onPressCard={() => onConfirm!("Vidro")} />
          <CardNovaColeta text="Entulhos" background="gray" onPressCard={() => onConfirm!("Entulhos")} />
        </View>
      </View>

      <View style={{marginTop:20, marginBottom:20, width:'50%', margin:"auto"}}>
        <DefaultButton text={"Cancelar"} onPressButton={()=> router.replace("/(private)/ecomorador/pages/solicitarColeta/page")}/>
      </View>
    </ScrollView>
  );
};

export default Etapa1;

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
    textAlign: "center",
    padding: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  mainContainerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    gap: 20,
    marginTop: 20,
    padding: 10,
  },
  subContainerCards: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    gap: 20,
  },
  card: {
    width: "25%",
  },
});
