import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import DefaultButtonProps from "../types/DefaultButtonProps";

const DefaultButton = ({ text, onPressButton }: DefaultButtonProps) => {
  return (
    <View>
      <Pressable style={styles.button} onPress={onPressButton}>
        <Text style={styles.textButton}>{text}</Text>
      </Pressable>
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
