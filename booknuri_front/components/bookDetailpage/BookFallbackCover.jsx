// 📁 components/book/BookFallbackCover.jsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const BookFallbackCover = ({ title }) => {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../image/book/default_cover.png')} // ✨ 너가 업로드한 이미지 저장해둔 거!
        style={styles.bg}
        resizeMode="cover"
      >
        <Text style={styles.titleText}>{title}</Text>
      </ImageBackground>
    </View>
  );
};

export default BookFallbackCover;

const styles = StyleSheet.create({
  wrapper: {
    width: fixwidth * 0.5,
    height: fixwidth * 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: fixwidth * 0.045,
    color: '#5B4034',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
