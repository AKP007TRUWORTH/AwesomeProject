import React, { useState, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const Blink = (props) => {
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0.5,
          duration: props.duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: props.duration,
          useNativeDriver: true,
        }),
      ]),
    );

    if (isAnimating) {
      animation.start();
    } else {
      animation.stop();
      fadeAnimation.setValue(1); // Reset to the initial value
    }

    return () => {
      animation.stop();
      fadeAnimation.setValue(1); // Clean up animation on unmount
    };
  }, [isAnimating, fadeAnimation, props.duration]);

  const startAnimation = () => {
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  return (
    <View style={{ ...props.style }}>
      <Animated.View style={{ opacity: fadeAnimation }}>
        {props.children}
      </Animated.View>
    </View>
  );
};

export default Blink;
