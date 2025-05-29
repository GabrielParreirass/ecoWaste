import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";


const PageTop = ({ profile }: any) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0097b2", "#7ed957"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.backgournd}
      >
        {profile ? (
          <Pressable style={styles.profileIcon} onPress={() => router.navigate("/(private)/ecomorador/pages/profile/page")}>
            <Ionicons name="person-circle-sharp" size={45} color="white" />
          </Pressable>
        ) : (
          <></>
        )}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </LinearGradient>
    </View>
  );
};

export default PageTop;

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  backgournd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    height: 150,
    width: 250,
  },
  profileIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
  },
});
