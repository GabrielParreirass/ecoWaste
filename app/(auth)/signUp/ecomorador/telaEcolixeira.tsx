import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import PageTop from "../../../components/PageTop";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomModal from "../../../components/popUps/CustomModal";

const TelaEcolixeira = () => {
  const [modalVisiblePrimeiraOpcao, setModalVisiblePrimeiraOpcao] =
    useState(false);
  const [modalVisibleCadastroRealizado, setModalVisibleCadastroRealizado] =
    useState(false);
  const [modalVisibleErroCadastro, setModalVisibleErroCadastro] =
    useState(false);
  const [modalVisiblePularCadastro, setModalVisiblePularCadastro] =
    useState(false);
  const [modalVisibleComprarLixeira, setModalVisibleComprarLixeira] =
    useState(false);
  const [modalVisibleCompraConfirmada, setModalVisibleCompraConfirmada] =
    useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <View>
      <PageTop />
      <View style={styles.container}>
        <Text style={styles.title}>Você possui nossa ecolixeira?</Text>
        <Text style={styles.icon}>
          <FontAwesome name="trash-o" size={80} color="green" />
        </Text>
        <View style={styles.containerButtons}>
          <Pressable
            style={styles.button}
            onPress={() => setModalVisiblePrimeiraOpcao(true)}
          >
            <Text style={styles.textButton}> Sim </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setModalVisibleComprarLixeira(true)}
          >
            <Text style={styles.textButton}> Não, quero adquirir </Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.textButton}> Não tenho interesse </Text>
          </Pressable>
        </View>
      </View>

      <CustomModal
        visible={modalVisiblePrimeiraOpcao}
        onClose={() => setModalVisiblePrimeiraOpcao(false)}
        message="Ótimo, chegou a hora de cadastrar sua lixeira. Vamos lá? Escaneie o QR CODE que vem nela"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisiblePrimeiraOpcao(false);
          setModalVisibleCadastroRealizado(true);
        }}
        confirmButtonText="Escanear"
        closeButtonText="Cancelar"
      />

      <CustomModal
        visible={modalVisibleCadastroRealizado}
        onClose={() => setModalVisibleCadastroRealizado(false)}
        message="Lixeira cadastrada com sucesso! Deseja ver nosso tutorial de ajuda?"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleCadastroRealizado(false);
        }}
        confirmButtonText="Ver"
        closeButtonText="Pular"
      />

      <CustomModal
        visible={modalVisibleErroCadastro}
        onClose={() => setModalVisibleErroCadastro(false)}
        message="Não conseguimos cadastrar sua lixeira, vamos tentar denovo?"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleErroCadastro(false);
        }}
        confirmButtonText="Escanear"
        closeButtonText="Cancelar"
      />

      <CustomModal
        visible={modalVisiblePularCadastro}
        onClose={() => setModalVisiblePularCadastro(false)}
        message="Para usar a nossa ecolixeira você deve cadastrá-la. Você poderá cadastrar a sua a qualquer momento pelo aplicativo. Deseja pular essa etapa?"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisiblePularCadastro(false);
        }}
        confirmButtonText="Tentar denovo"
        closeButtonText="Pular"
      />

      <CustomModal
        visible={modalVisibleComprarLixeira}
        onClose={() => setModalVisibleComprarLixeira(false)}
        message="Você pode adquirir nossa lixeira pelo aplicativo. Ao confirmar sua opção, um de nossos representantes irá entrar em contato para relizar a venda e instalação. Deseja adquirir nossa Ecolixeira?"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleComprarLixeira(false);
          setModalVisibleCompraConfirmada(true);
        }}
      />

      <CustomModal
        visible={modalVisibleCompraConfirmada}
        onClose={() => setModalVisibleCompraConfirmada(false)}
        message="Prontinho!!! Agora é só aguardar um de nossos atendentes entrar em contato. Por enquanto, você poderá usar o aplicativo para reciclar seus resíduos contatando um catador diretamente!"
        inputValue={inputValue}
        setInputValue={setInputValue}
        onConfirm={() => {
          setModalVisibleCompraConfirmada(false);
        }}
      />
    </View>
  );
};

export default TelaEcolixeira;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "#0fa05f",
    fontWeight: "bold",
  },
  icon: {
    padding: 20,
  },
  containerButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#0fa05f",
    padding: 10,
    borderRadius: 10,
  },
  textButton: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
