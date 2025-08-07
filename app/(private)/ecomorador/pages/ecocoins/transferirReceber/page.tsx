import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import PageTop from "../../../../../components/PageTop";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import DefaultButton from "../../../../../components/DefaultButton";

const TransferirReceber = () => {
  return (
    
    <SafeAreaView>
      <ScrollView>
        <PageTop profile={false} />
        <View style={styles.containerIcon}>
          <View style={styles.icon}>
            <FontAwesome6 name="money-bill-transfer" size={60} color="green" />
          </View>
        </View>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>CÂMBIO: 1 ECO COIN = R$0,50</Text>
        </View>
        <View style={styles.containerBtns}>
          <TouchableOpacity
          activeOpacity={0.7}
            onPress={() =>
              router.navigate(
                "/(private)/ecomorador/pages/ecocoins/transferirReceber/pagar/page"
              )
            }
          >
            <LinearGradient
              colors={["#0097b2", "#7ed957"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.button}
            >
              <FontAwesome5 name="money-bill-alt" size={80} color="white" />
              <Text style={styles.textButton}>PAGAR</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
          activeOpacity={0.7}
            onPress={() =>
              router.navigate(
                "/(private)/ecomorador/pages/ecocoins/transferirReceber/receber/page"
              )
            }
          >
            <LinearGradient
              colors={["#0097b2", "#7ed957"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.button}
            >
              <MaterialIcons name="payments" size={80} color="white" />
              <Text style={styles.textButton}>RECEBER</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.containerBtns}>
          <TouchableOpacity
          activeOpacity={0.7}
            onPress={() =>
              router.navigate(
                "/(private)/ecomorador/pages/ecocoins/transferirReceber/extrato/page"
              )
            }
          >
            <LinearGradient
              colors={["#0097b2", "#7ed957"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.button}
            >
              <MaterialCommunityIcons name="bank" size={80} color="white" />
              <Text style={styles.textButton}>EXTRATO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.containerDefaultButton}>
          <DefaultButton text={"Sair"} onPressButton={() => router.back()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransferirReceber;

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
    fontSize: 17,
  },
  containerBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 10,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    maxWidth: 150,
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  containerDefaultButton: {
    width: "80%",
    margin: "auto",
  },
});
