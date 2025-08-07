import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import PageTop from "../../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DefaultButton from "../../../../../components/DefaultButton";
import { router } from "expo-router";

const ReservarColetas = () => {
  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="calendar-check" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>
          Selecione da lista ou pesquise pelo código.
        </Text>
      </View>

      <View style={styles.containerInput}>
        <TextInput style={styles.input} placeholder="Pesquisar código" />
        <Pressable style={styles.btnInput}>
          <FontAwesome5 name="search" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.containerKeys}>
        <Pressable style={styles.key}>
          <View>
            <Text style={styles.textKeys}>Papel: 2kg</Text>
          </View>
        </Pressable>
        <Pressable style={styles.key}>
          <View>
            <Text style={styles.textKeys}>Papel: 2kg</Text>
          </View>
        </Pressable>
        <Pressable style={styles.key}>
          <View>
            <Text style={styles.textKeys}>Papel: 2kg</Text>
          </View>
        </Pressable>
      </View>

      <View style={{ width: "70%", margin: "auto", paddingTop: 10 }}>
        <DefaultButton text={"Voltar"} onPressButton={() => router.back()} />
      </View>
    </ScrollView>
  );
};

export default ReservarColetas;

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
  containerBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 30,
  },
  containerInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    margin: "auto",
  },
  input: {
    borderBottomColor: "#96cda9",
    borderBottomWidth: 2,
    width: "70%",
  },
  btnInput: {
    backgroundColor: "#0fa05f",
    padding: 8,
    borderRadius: 100,
  },
  containerKeys: {
    backgroundColor: "#96cda9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    marginBottom: 30,
    width: "90%",
    padding: 20,
    margin: "auto",
    borderRadius:15
  },
  key: {
    padding: 15,
    backgroundColor: "#096600",
    width: "70%",
    borderRadius: 15,
  },
  textKeys: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
