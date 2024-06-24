/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View, Text } from "react-native";
import colors from "../styles/colors";

export const Avatar = ({ fullName, style, fontSize, containerBackgroundColor, containContainerStyle }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: containerBackgroundColor,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        overflow: "hidden",
        ...containContainerStyle
      }}
    >
      <View
        style={{
          ...style,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Text
          style={{
            fontSize: fontSize,
            color: colors.primary[100],
          }}
        >
          {fullName && fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
