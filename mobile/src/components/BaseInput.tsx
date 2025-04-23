import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface BaseInputProps extends TextInputProps {
  placeholder: string;
}

const BaseInput: React.FC<BaseInputProps> = ({ placeholder, style, ...props }) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#888"
      style={[styles.input, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#f9f9f9",
  },
});

export default BaseInput;
