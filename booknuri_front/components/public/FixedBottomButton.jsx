import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const FixedBottomButton = ({ disabled, onPress, label = "다음" }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions(); // ✅ 진짜 화면 기준 width

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom+fixwidth*0.005,  width: width*1}]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width:fixwidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal:fixwidth*0.005,
  },
  button: {
    height: fixwidth*0.14,
    backgroundColor: "#bca48e",
    borderRadius: fixwidth*0.007,
    alignItems: 'center',
    justifyContent: 'center',

  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
/*    fontWeight: 'bold',*/
    fontSize: fixwidth*0.05,
  }
});

export default FixedBottomButton;
