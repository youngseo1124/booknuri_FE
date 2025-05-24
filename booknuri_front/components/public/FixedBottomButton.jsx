import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width: fixwidth } = Dimensions.get('window');

const FixedBottomButton = ({ disabled, onPress, label = "다음" }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom  }]}>
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

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: fixwidth * 0.14,
    backgroundColor: '#bca48e',
    borderRadius: fixwidth * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: fixwidth * 0.045,
    fontFamily: 'NanumGothic-Regular',
  },
});

export default FixedBottomButton;
