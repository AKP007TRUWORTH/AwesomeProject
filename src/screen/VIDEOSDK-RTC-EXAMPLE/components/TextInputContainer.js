import React from "react";
import { View, TextInput } from "react-native";
import colors from "../styles/colors";

const TextInputContainer = ({ placeholder, value, setValue }) => {
  return (
    <View
      style={{
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        borderRadius: 12,
        marginVertical: 12,
        // borderWidth: 1,
        // borderColor: '#4890E0'
      }}
    >
      <TextInput
        style={{
          margin: 8,
          padding: 8,
          width: "90%",
          textAlign: "center",
          fontSize: 14,
          color: colors.primary[100],
        }}
        multiline={true}
        numberOfLines={1}
        cursorColor={"#4890E0"}
        placeholder={placeholder}
        placeholderTextColor={"#FFFFFF"}
        onChangeText={(text) => {
          setValue(text);
        }}
        value={value}
      />
    </View>
  );
};

export default TextInputContainer;
