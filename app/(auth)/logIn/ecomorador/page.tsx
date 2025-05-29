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
import { useAuth } from "../../../contexts/AuthContext";


const EcomoradorSignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [psswdValue, setPsswdValue] = useState("");

  const {onLogin, onConfirmOtp} = useAuth();

  const login = async () =>{

    console.log("Email do LOGIN: ", emailValue)

    const result = await onLogin!(emailValue, psswdValue);
    if (result){
      console.log("Estou aqui!: ", result)
      setModalVisible(true)
    }else{
      alert("Falha no login")
    }
  }

  const confirmOtp = async (otpValue:string) =>{
    const result = await onConfirmOtp!(emailValue, otpValue)
    if (result){
      console.log("ResultConfirmOtp:", result)
    }else{
      alert("O código inserido está incorreto!")
    }
  }

  const handleSubmit = async () =>{

    console.log("aqui")

    if (
      emailValue.length == 0 ||
      psswdValue.length == 0
    ) {
      setAlertModalVisible(true);
    } else {

      login();
          
    }
  }

  return (
    <View>
      <ScrollView>
        <PageTop />
        <View style={styles.container}>
          <Text> Olá, ecomorador, bem vindo de volta!</Text>
          <Image
            source={require("../../../../assets/images/imgEcomorador2.png")}
            style={styles.imgEcomorador}
          />
        </View>

        <View style={styles.containerInput}>
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
            <Text style={styles.textButton}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="Para efetuar o login, insira o código de verificação enviado para seu email: "
        showInput={true}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          confirmOtp(inputValue)
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
