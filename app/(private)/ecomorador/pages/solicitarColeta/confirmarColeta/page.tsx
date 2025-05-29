import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import PageTop from "../../../../../components/PageTop";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomModal from "../../../../../components/popUps/CustomModal";
import { router } from "expo-router";


const ConfirmarColeta = () => {

    const [modalVisibile, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState("")

  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <AntDesign name="checkcircleo" size={60} color="green" />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>
          Que ótima notícia! Para confirmar a retirada e computar seus ganhos
          escaneie o qr code do app ecotaxista:
        </Text>
        <MaterialCommunityIcons name="qrcode-scan" size={80} color="black" />
        <View style={styles.containerButtons}>
          <Pressable style={styles.button} onPress={()=> router.back()}>
            <Text style={styles.textButton}>Voltar</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={()=> setModalVisible(true)}>
            <Text style={styles.textButton}>Escanear</Text>
          </Pressable>
        </View>
      </View>

      <CustomModal
        visible={modalVisibile}
                onClose={() => setModalVisible(false)}
                message="Coleta completa! Você ganhou 30 EcoCoins que já estão disponíveis na sua carteira!"
                showInput={false}
                inputValue={inputValue}
                setInputValue={setInputValue}
                onConfirm={() => {
                  setModalVisible(false)
                }}
                confirmButtonText="Carteira"
      />
    </ScrollView>
  );
};

export default ConfirmarColeta;

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
  container:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },
  text:{
    color:"#0fa05f",
    fontWeight:'bold',
    fontSize:17,
    marginBottom:50,
    textAlign:'center'
  },
  containerButtons:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:30,
    marginTop:50
  },
  button:{
    backgroundColor:"#0fa05f",
    padding:15,
    borderRadius:10,
    width:"40%",
    display:'flex',
    alignItems:'center'
  },
  textButton:{
    color:"#fff",
    fontWeight:'bold',
    textTransform:'uppercase'
  }
  
});
