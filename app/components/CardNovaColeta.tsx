import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const CardNovaColeta = ({ text, background, onPressCard }: any) => {
  return (
    <Pressable
      style={{
        backgroundColor: background,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        paddingTop: 40,
        paddingBottom: 40,
        borderRadius: 10,
      }}
      onPress={onPressCard}
    >
      <FontAwesome5 name="recycle" size={40} color="white" />
      <Text style={{ color: "white", fontWeight: "bold" }}>{text}</Text>
    </Pressable>
  );
};


export default CardNovaColeta