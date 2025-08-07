import { View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import DefaultButtonProps from "../types/DefaultButtonProps";

const DefaultButton = ({ text, onPressButton }: DefaultButtonProps) => {
  return (
    <View>
      <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={onPressButton}>
        <Text style={styles.textButton}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0fa05f",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    width:"100%"
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    
  },
});

export default DefaultButton;
