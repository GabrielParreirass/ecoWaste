import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const nextLanguage = language === "pt" ? "en" : "pt";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={nextLanguage === "pt" ? "Português" : "English"}
      onPress={() => setLanguage(nextLanguage)}
      style={({ pressed }) => [
        styles.button,
        { right: insets.right + 16, bottom: insets.bottom + 16 },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="language-outline" size={24} color="#fff" />
      <Text style={styles.text}>{nextLanguage.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    zIndex: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#096600",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  text: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  pressed: { opacity: 0.7 },
});
