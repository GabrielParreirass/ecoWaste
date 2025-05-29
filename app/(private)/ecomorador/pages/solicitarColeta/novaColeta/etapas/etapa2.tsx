import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import DefaultButton from "../../../../../../components/DefaultButton";
import EtapasProps from "../../../../../../types/EtapasProps";
import { router } from "expo-router";

const Etapa2 = ({inputValue, setInputValue, onConfirm}: EtapasProps) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>
          Estime a quantidade
        </Text>
      </View>
      <View style={styles.containerCards}>
        <Pressable style={styles.card} onPress={() => onConfirm!("Menos que 500g")}>
            <Text style={styles.textCard}>Menos que 500g</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => onConfirm!("Entre 500g e 2kg")}>
            <Text style={styles.textCard}>Entre 500g e 2kg</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => onConfirm!("Entre 2kg e 5kg")}>
            <Text style={styles.textCard}>Entre 2kg e 5kg</Text>
        </Pressable >
        <Pressable style={styles.card} onPress={() => onConfirm!("Entre 5kg e 10kg")}>
            <Text style={styles.textCard}>Entre 5kg e 10kg</Text>
        </Pressable >
        <Pressable style={styles.card} onPress={() => onConfirm!("Mais que 10kg")}>
            <Text style={styles.textCard}>Mais que 10kg</Text>
        </Pressable>
      </View>

      <View style={{marginTop:20, width:'50%', margin:"auto"}}>
        <DefaultButton text={"Cancelar"} onPressButton={()=> router.replace("/(private)/ecomorador/pages/solicitarColeta/page")}/>
      </View>
      
    </ScrollView>
  );
};

export default Etapa2;

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
  containerCards:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    gap:20
  },
  card:{
    backgroundColor:'green',
    width:'80%',
    padding:10,
    borderRadius:10
  },
  textCard:{
    color:'#fff',
    fontWeight:'bold',
    textAlign:'center'
  }
  
});
