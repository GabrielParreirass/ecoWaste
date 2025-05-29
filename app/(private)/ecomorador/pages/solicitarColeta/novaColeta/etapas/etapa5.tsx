import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import DefaultButton from "../../../../../../components/DefaultButton";
import EtapasProps from "../../../../../../types/EtapasProps";
import { router } from "expo-router";

const Etapa5 = ({inputValue, setInputValue, onConfirm}: EtapasProps) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>
          Agora só basta confirmar sua solicitação para que os coletores possam vê-la!
        </Text>
        <View style={{margin:"auto"}}>
            <Image
              source={require("../../../../../../../assets/images/imgHome.png")}
              style={styles.logo}
            />
        </View>
        <Text style={styles.title}>
          Assim que ela for selecionada para coleta, você receberá uma aviso!
        </Text>
      </View>
      <View style={styles.containerButtons}>
        <DefaultButton text={"Confirmar"} onPressButton={() => onConfirm!("")}/>
        <DefaultButton text={"Ver solicitações"} onPressButton={()=> router.replace("/(private)/ecomorador/pages/solicitarColeta/coletasEmEspera/page")}/>
      </View>
    </ScrollView>
  );
};

export default Etapa5;

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
  logo: {
    height: 200,
    width: 200,
  },
  containerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  subContainerCards: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  card: {
    backgroundColor: "green",
    borderRadius: "50%",
    width: "30%",
  },
  textCard: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    padding: 30,
    
  },
  containerButtons:{
    display:'flex',
    gap:10,
    justifyContent:'center',
    width:'50%',
    margin:'auto'
  }
});
