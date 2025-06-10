import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface BaseButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BaseButton: React.FC<BaseButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  primary: {
    backgroundColor: "hsl(264, 70%, 50%)",
  },
  secondary: {
    backgroundColor: "#555",
  },
});

export default BaseButton;