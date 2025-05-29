import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import DefaultButton from "../../../../../../components/DefaultButton";
import EtapasProps from "../../../../../../types/EtapasProps";
import { router } from "expo-router";

const Etapa3 = ({inputValue, setInputValue, onConfirm}: EtapasProps) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Informe o dia da semana</Text>
      </View>
      <View style={styles.containerCards}>
        <View style={styles.subContainerCards}>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Doming")}>
            <Text style={styles.textCard}>Dom</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Segunda-feira")}>
            <Text style={styles.textCard}>Seg</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Terça-feira")}>
            <Text style={styles.textCard}>Ter</Text>
          </Pressable>
        </View>
        <View style={styles.subContainerCards}>
          <Pressable style={styles.card } onPress={()=>onConfirm!("Quarta-feira")}>
            <Text style={styles.textCard}>Qua</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Quinta-feira")}>
            <Text style={styles.textCard}>Qui</Text>
          </Pressable>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Sexta-feira")}>
            <Text style={styles.textCard}>Sex</Text>
          </Pressable>
        </View>
        <View>
          <Pressable style={styles.card} onPress={()=>onConfirm!("Sabado")}>
            <Text style={styles.textCard}>Sab</Text>
          </Pressable>
        </View>
      </View>
      <View style={{marginTop:20, width:'50%', margin:"auto"}}>
        <DefaultButton text={"Cancelar"} onPressButton={()=> router.replace("/(private)/ecomorador/pages/solicitarColeta/page")}/>
      </View>
    </ScrollView>
  );
};

export default Etapa3;

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
  },
  subContainerCards:{
    display:'flex',
    flexDirection:'row',
    gap:15
  },
  card: {
    backgroundColor: "green",
    
    borderRadius: '50%',
    width:'25%',

  },
  textCard: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform:'uppercase',
    padding: 30,
  },
});
