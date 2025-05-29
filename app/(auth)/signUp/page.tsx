import { StyleSheet, Text, View } from "react-native";
import React, { Component } from "react";
import PageTop from "../../components/PageTop";
import { Image } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";

export class SingUp extends Component {
  render() {
    return (
      <View>
        <PageTop />
        <Text style={styles.pageTitle}>Olá, você quer:</Text>
        <View>
          <View style={styles.containerEcomorador}>
            <Image
              source={require("../../../assets/images/imgCadastroEcomorador.png")}
              style={styles.imgEcomorador}
            />
            <View style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={styles.descEcomorador}>Reciclar meus resíduos</Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View style={styles.connectorLine}></View>
                <Pressable onPress={() => router.navigate("/(auth)/signUp/ecomorador/page")}>
                  <Text style={styles.titleEcomorador}>ECOMORADOR</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.containerEcotaxista}>
            <Image
              source={require("../../../assets/images/imgCadastroEcotaxista.png")}
              style={styles.imgEcomorador}
            />
            <View style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={styles.descEcotaxista}>
                Coletar resíduos recicláveis
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleEcotaxista}>ECOTAXISTA</Text>
                <View style={styles.connectorLineEcotaxista}></View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default SingUp;

const styles = StyleSheet.create({
  containerEcomorador: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 40,
  },
  pageTitle: {
    textAlign: "center",
    padding: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "#0fa05f",
    textTransform: "uppercase",
  },
  descEcomorador: {
    borderBottomColor: "#0fa05f",
    borderBottomWidth: 2,
    fontSize: 20,
    color: "#0fa05f",
    fontWeight: "bold",
  },
  titleEcomorador: {
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#0fa05f",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 65,
    padding: 10,
    borderRadius: 10,
  },
  connectorLine: {
    borderColor: "#0fa05f",
    borderWidth: 1,
    marginBottom: 65,
    width: 100,
    marginLeft: -20,
    zIndex: -10,
  },
  imgEcomorador: {
    height: 150,
    width: 125,
    marginTop: 27,
  },
  containerEcotaxista: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  descEcotaxista: {
    borderBottomColor: "#0fa05f",
    borderBottomWidth: 2,
    fontSize: 20,
    color: "#0fa05f",
    fontWeight: "bold",
    marginRight: -50,
  },
  titleEcotaxista: {
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#0fa05f",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 65,
    padding: 10,
    borderRadius: 10,
  },
  connectorLineEcotaxista: {
    borderColor: "#0fa05f",
    borderWidth: 1,
    marginBottom: 65,
    width: 100,
    marginRight: -20,
    zIndex: -10,
  },
});
