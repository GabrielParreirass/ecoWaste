import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import PageTop from "../../../../components/PageTop";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CustomModal from "../../../../components/popUps/CustomModal";
import { useState, useEffect, useRef } from "react";
import apiUrl from "../../../../utils/api_url.json";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import { createMqttOptions } from "../../../../utils/mqttOptions";

const Profile = () => {
  const [modalVisibleEditarDados, setModalVisibleEditarDados] = useState(false);
  const [modalVisibleDeletarDados, setModalVisibleDeletarDados] =
    useState(false);
  const [inputValue, setInputValue] = useState("");
  const [nomeValue, setNomeValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const API_URL = apiUrl.apiUrl;

  const { authState } = useAuth();

  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/editProfileResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/editProfileResponse/${requestId.current}`
            );
          }
        }
      );
    });
    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      const formatedData = JSON.parse(message.toString());
      window.alert(formatedData.message);
    });
  }, []);

  const handleSubmit = async () => {
    console.log({ nomeValue, emailValue });

    const payload = {
      name: nomeValue,
      email: emailValue,
      requestId: requestId.current,
    };
    client.current?.publish("user/editProfile", JSON.stringify(payload));

    setEmailValue("");
    setNomeValue("");
    //setModalVisibleEditarDados(true)
  };

  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Ionicons name="person" size={70} color="green" />
        </View>
      </View>
      <Text style={styles.title}>Perfil de {authState!.username}</Text>
      <View style={styles.containerIcon}>
        <FontAwesome5 name="user-edit" size={30} color="green" />
      </View>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="NOME"
          value={nomeValue}
          onChangeText={setNomeValue}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="EMAIL ATUAL"
          value={emailValue}
          onChangeText={setEmailValue}
        ></TextInput>
      </View>
      <View style={styles.containerButtons}>
        <Pressable style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.textButton}>OK</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setModalVisibleDeletarDados(true)}
        >
          <Text style={styles.textButton}>DELETAR</Text>
        </Pressable>
      </View>

      <CustomModal
        visible={modalVisibleEditarDados}
        onClose={() => setModalVisibleEditarDados(false)}
        message="Para confirmar a edição de seus dados, insira o código de verificação enviado para seu email: "
        showInput={true}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleEditarDados(false);
        }}
      />

      <CustomModal
        visible={modalVisibleDeletarDados}
        onClose={() => setModalVisibleDeletarDados(false)}
        message="Seus dados serão deletados do nosso sistema. Seu Saldo de Eco Coin será doado para uma instituição que apoiamos. Você poderá criar uma nova conta a qualquer momento Confirme a sua escolha: "
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleDeletarDados(false);
        }}
        closeButtonText="cancelar"
      />
    </ScrollView>
  );
};

export default Profile;

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
    padding: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0fa05f",
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#0fa05f",
    borderBottomWidth: 2,
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
