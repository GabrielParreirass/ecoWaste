import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import DefaultButton from "../../../../../../components/DefaultButton";
import EtapasProps from "../../../../../../../types/EtapasProps";
import { router } from "expo-router";

const Etapa4 = ({inputValue, setInputValue, onConfirm}: EtapasProps) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Informe o horário</Text>
      </View>
      <View style={styles.containerCards}>
        <View style={styles.subContainerCards}>
          <Pressable style={styles.card} onPress={() =>onConfirm!("8h às 10h")}>
            <Text style={styles.textCard}>8h às 10h</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={() =>onConfirm!("10h às 12h")}> 
            <Text style={styles.textCard}>10h às 12h</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={() =>onConfirm!("12h às 13h")}>
            <Text style={styles.textCard}>12h às 13h</Text>
          </Pressable>
        </View>
        <View style={styles.subContainerCards}>
          <Pressable style={styles.card} onPress={() =>onConfirm!("13h às 15h")}>
            <Text style={styles.textCard}>13h às 15h</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={() =>onConfirm!("15h às 17h")}>
            <Text style={styles.textCard}>15h às 17h</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={() =>onConfirm!("17h às 18h")}>
            <Text style={styles.textCard}>17 às 18h</Text>
          </Pressable>
        </View>
      </View>
      <View style={{marginTop:20, width:'50%', margin:"auto"}}>
        <DefaultButton text={"Cancelar"} onPressButton={()=> router.replace("/(private)/ecomorador/pages/solicitarColeta/page")}/>
      </View>
    </ScrollView>
  );
};

export default Etapa4;

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
  containerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop:20
  },
  subContainerCards:{
    display:'flex',
    flexDirection:'row',
    gap:15
  },
  card: {
    backgroundColor: "green",
    borderRadius: '50%',
    width:'30%',

  },
  textCard: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform:'uppercase',
    padding: 30,
  },

});
