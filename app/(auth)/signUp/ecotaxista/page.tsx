import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import PageTop from "../../../components/PageTop";
import { router } from "expo-router";
import CustomModal from "../../../components/popUps/CustomModal";
import axios from "axios";
import apiUrl from "../../../utils/api_url.json";
import { useAuth } from "../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import { createMqttOptions } from "../../../utils/mqttOptions";

const EcotaxistaSignUp = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [nomeValue, setNomeValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [psswdValue, setPsswdValue] = useState("");

  const { onRegister } = useAuth();

  const API_URL = apiUrl.apiUrl;
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/verificateOtpResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/verificateOtpResponse/${requestId.current}`
            );
          }
        }
      );
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedData = JSON.parse(message.toString());
      if (topic == `user/verificateOtpResponse/${requestId.current}`) {
        if (formatedData.otpVerified) {
          alert(formatedData.message);
          setModalVisible(false);
          router.navigate("/(auth)/logIn/ecotaxista/page");
        } else {
          alert(formatedData.message);
        }
      }
    });
  }, []);

  const register = async () => {
    const role = "ecotaxista";
    const result = await onRegister!(nomeValue, emailValue, psswdValue, role);
    console.log(result);
    if (result.create) {
      setModalVisible(true);
    } else {
      alert(result.message);
    }
  };

  const handleSubmit = async () => {
    if (
      nomeValue.length == 0 ||
      emailValue.length == 0 ||
      psswdValue.length == 0
    ) {
      setAlertModalVisible(true);
    } else {
      console.log("iniciando cadastro");

      register();
    }
  };

  const handleConfirmOtp = async (otpInput: string) => {
    const payload = {
      email: emailValue,
      otp: otpInput,
      requestId: requestId.current,
    };
    client.current?.publish("user/verificateOtp", JSON.stringify(payload));
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageTop />
        <View style={styles.container}>
          <Text style={styles.title}> Olá, ecotaxista, vamos cadastrá-lo</Text>
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
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.textButton}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.textButton}>Cadastrar</Text>
          </TouchableOpacity>
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
          handleConfirmOtp(inputValue);
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
          router.navigate("/(auth)/logIn/ecomorador/page");
        }}
        confirmButtonText="Ir para Login"
      />
    </KeyboardAvoidingView>
  );
};

export default EcotaxistaSignUp;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
  title: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
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
    flex: 1,
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
