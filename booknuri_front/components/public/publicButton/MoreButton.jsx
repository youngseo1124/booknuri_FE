import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const MoreButton = ({ label = '전체 보기', onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MoreButton;

const styles = StyleSheet.create({
  button: {
    width: '99.5%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.024,
    borderRadius: fixwidth * 0.017,
    borderWidth: fixwidth * 0.0057,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  text: {
    fontSize: fixwidth * 0.036,
    color: 'rgba(0,0,0,0.38)',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.06,
    textAlign: 'center',

  },
});
