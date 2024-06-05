import React from "react";
import { TouchableOpacity, Text } from "react-native";
import colors from "../../styles/colors";
import { ROBOTO_FONTS } from "../../styles/fonts";

const Button = ({
  text,
  backgroundColor,
  onPress,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor ? backgroundColor : "#4890E0",
        borderRadius: 12,
        marginVertical: 12,
        ...style,
      }}
    >
      <Text
        style={{
          color: colors.primary["100"],
          fontSize: 16,
          fontFamily: ROBOTO_FONTS.RobotoBold,
          ...textStyle,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export default Button;
