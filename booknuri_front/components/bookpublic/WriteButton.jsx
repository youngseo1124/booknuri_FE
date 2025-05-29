import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const WriteButton = ({ label = '쓰기', onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default WriteButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.026,
    borderRadius: fixwidth * 0.017,
    borderColor: 'rgba(0,0,0,0.15)',
    backgroundColor: 'rgb(97,156,245)'
  },
  text: {
    fontSize: fixwidth * 0.0377,
    color: 'rgb(255,255,255)',
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.06,
    textAlign: 'center',

  },
});
