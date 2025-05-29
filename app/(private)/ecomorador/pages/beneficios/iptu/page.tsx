import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import PageTop from "../../../../../components/PageTop";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DefaultButton from "../../../../../components/DefaultButton";
import { useState } from "react";
import CustomModal from "../../../../../components/popUps/CustomModal";
import { router } from "expo-router";

const DescontoIptu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmEmailVisible, setModalConfirmEmailVisible] =
    useState(false);

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome6 name="house-chimney" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Desconto na próxima cobrança: R$100,00</Text>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          O seu saldo atual sera usado para gerar desconto no pagamento do seu
          próximo IPTU
        </Text>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Ao confirmar a operação, a prefeitura da sua cidade será notificada e
          o seu saldo será zerado.
        </Text>
      </View>
      <View style={styles.containerDefaultBtn}>
        <DefaultButton text={"Voltar"} onPressButton={()=> router.back()} />
        <DefaultButton
          text={"Confirmar"}
          onPressButton={() => setModalConfirmEmailVisible(true)}
        />
      </View>

      <CustomModal
        visible={modalConfirmEmailVisible}
        onClose={() => setModalConfirmEmailVisible(false)}
        message="Insira o código enviado para seu email"
        showInput={true}
        onConfirm={() => {
          setModalConfirmEmailVisible(false);
          setModalVisible(true)
        }}
        confirmButtonText="Confirmar"
      />
       <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        message="Seu saldo gerou um desconto de 10% no próximo IPTU!  Continue reciclando!"
        showInput={false}
        onConfirm={() => {
          setModalVisible(false);
        }}
        confirmButtonText="confirmar"
      />

      
    </ScrollView>
  );
};

export default DescontoIptu;

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
  containerTitle: {
    maxWidth: "90%",
    margin: "auto",
    padding: 10,
  },
  title: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  containerDefaultBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 20,
  },
});
