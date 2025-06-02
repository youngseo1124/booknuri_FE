import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width: fixwidth } = Dimensions.get('window');

const QuoteFontSizeSlider = ({ fontScale, onChange }) => {
  return (
    <View style={styles.container}>
      {/* 한 줄: 글자 크기 + 슬라이더 + 숫자 */}
      <Text style={styles.label}>글자 크기:</Text>

      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={14}
        step={0.5}
        value={fontScale}
        onValueChange={onChange}
        minimumTrackTintColor="#ff5500"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#ff5500"
      />

      <Text style={styles.value}>{fontScale.toFixed(1)}</Text>
    </View>
  );
};

export default QuoteFontSizeSlider;

const styles = StyleSheet.create({
  container: {
    marginVertical: fixwidth * 0.005,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.02,
  },
  label: {
    fontSize: fixwidth * 0.035,
    marginRight: fixwidth * 0.02,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
  },
  slider: {
    flex: 1,
    height: fixwidth * 0.055,
  },
  value: {
    marginLeft: fixwidth * 0.025,
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Medium',
    color: '#333',
    width: fixwidth * 0.1,
    textAlign: 'right',
  },
});
