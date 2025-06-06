import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const ScrollToTopButton = ({
                             onPress,
                             bottom = fixwidth * 0.317,
                             right = fixwidth * 0.0377,
                           }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { bottom, right }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={require('../../../image/utill/up_arrow.png')} // ⬅ 경로 맞게 수정!
        style={styles.icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.87)',
    borderRadius: fixwidth * 0.07,
    padding: fixwidth * 0.037,
    borderWidth: fixwidth * 0.0017,
    borderColor: 'rgba(0,0,0,0.21)',
    zIndex: 10,
  },
  icon: {
    width: fixwidth * 0.045,
    height: fixwidth * 0.045,
  },
});

export default ScrollToTopButton;
