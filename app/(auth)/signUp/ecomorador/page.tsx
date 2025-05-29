import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import PageTop from "../../../components/PageTop";
import { router } from "expo-router";
import CustomModal from "../../../components/popUps/CustomModal";
import axios from "axios";
import apiUrl from "../../../utils/api_url.json";
import { useAuth } from "../../../contexts/AuthContext";

const EcomoradorSignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [nomeValue, setNomeValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [psswdValue, setPsswdValue] = useState("");

  const {onRegister} = useAuth();

  const API_URL = apiUrl.apiUrl;


  const register = async() =>{
    const result = await onRegister!(nomeValue, emailValue, psswdValue)
    if(result.create){
      setModalVisible(true)
    }else{
      alert(result.message)
    }
  }

  const handleSubmit = async () => {
    if (
      nomeValue.length == 0 ||
      emailValue.length == 0 ||
      psswdValue.length == 0
    ) {
      setAlertModalVisible(true);
    } else {

      console.log("iniciando cadastro")

      register();

    }
  };

  const handleConfirmOtp = async (otpInput:string) =>{

    const response = await axios.post(`${API_URL}/verificateOtp`, {
      email: emailValue,
      otp: otpInput
    })

    console.log(response.data)

    if(response.data.otpVerified){
      alert(response.data.message)
      setModalVisible(false)
      router.navigate("/(auth)/logIn/ecomorador/page")
    }else{
      alert(response.data.message)
    }

    
  }

  return (
    <View>
      <ScrollView>
        <PageTop />
        <View style={styles.container}>
          <Text> Olá, ecomorador, vamos cadastrá-lo</Text>
          <Image
            source={require("../../../../assets/images/imgEcomorador2.png")}
            style={styles.imgEcomorador}
          />
        </View>

        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nomeValue}
            onChangeText={(e) => setNomeValue(e)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={emailValue}
            onChangeText={(e) => setEmailValue(e)}
          ></TextInput>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={psswdValue}
            onChangeText={(e) => setPsswdValue(e)}
            secureTextEntry={true}
          ></TextInput>
        </View>

        <View style={styles.containerButtons}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.textButton}>Voltar</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => handleSubmit()}>
            <Text style={styles.textButton}>Cadastrar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="Estamos verificando seu email. Informe o código enviado: "
        showInput={true}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          handleConfirmOtp(inputValue)
        }}
      />
      <CustomModal
        visible={alertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        message="Preencha todos os campos!"
        showInput={false}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setAlertModalVisible(false);
        }}
      />
      <CustomModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message="Cadastro efetuado com sucesso, deseja seguir para a página de login?"
        showInput={false}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          router.navigate("/(auth)/logIn/ecomorador/page")
        }}
        confirmButtonText="Ir para Login"
      />
    </View>
  );
};

export default EcomoradorSignUp;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imgEcomorador: {
    height: 150,
    width: 150,
    marginTop: 27,
  },
  input: {
    borderBottomColor: "#0fa05f",
    borderBottomWidth: 2,
    borderStyle: "dashed",
    marginTop: 5,
  },
  containerInput: {
    padding: 20,
    color: "#0fa05f",
    flex:1,
  },
  containerButtons: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#0fa05f",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    width: 130,
    borderRadius: 10,
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
  },
});
