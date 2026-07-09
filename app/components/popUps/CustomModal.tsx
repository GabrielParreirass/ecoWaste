import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomModalProps from "../../../types/CustomModalProps";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const CustomModal = ({
  visible,
  onClose,
  message,
  showInput,
  onConfirm,
  inputValue,
  setInputValue,
  confirmButtonText,
  closeButtonText,
  stackedButtons, 
  onMapPress,
}: CustomModalProps) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#0097b2", "#7ed957"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modalContainer}
        >
          <View style={{ marginVertical: 0 }}>
            {message.split("\n").map((line, index) => (
              <Text key={index} style={styles.message}>
                {line}
              </Text>
            ))}
          </View>

          {onMapPress && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onMapPress}
              style={styles.mapButton}
            >
              <FontAwesome5 name="map-marked-alt" size={20} color="#fff" />
              <Text style={styles.textMapButton}>Abrir no Google Maps</Text>
            </TouchableOpacity>
          )}

          {showInput && (
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Digite aqui..."
            />
          )}

       
          <View 
            style={[
              styles.buttonContainer, 
              stackedButtons && styles.buttonContainerStacked
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.button, stackedButtons && styles.stackedButton]} 
            >
              {closeButtonText ? (
                <Text style={styles.textButton}>{closeButtonText}</Text>
              ) : (
                <Text style={styles.textButton}>Fechar</Text>
              )}
            </TouchableOpacity>
            
            {onConfirm && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onConfirm}
                style={[styles.button, stackedButtons && styles.stackedButton]} 
              >
                {confirmButtonText ? (
                  <Text style={styles.textButton}>{confirmButtonText}</Text>
                ) : (
                  <Text style={styles.textButton}>Confirmar</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 4,
  },
  message: {
    marginVertical: 10,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
 
  buttonContainerStacked: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 15, 
  },
  stackedButton: {
    width: "100%", 
  },
  
  button: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  textButton: {
    color: "#0fa05f",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#006b80", 
    padding: 12,
    borderRadius: 10,
    width: "95%",
    marginVertical: 10,
  },
  textMapButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default CustomModal;