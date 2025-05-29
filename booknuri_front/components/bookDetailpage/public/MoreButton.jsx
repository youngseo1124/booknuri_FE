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
    width: '100%',
    alignSelf: 'center',
    marginTop: fixwidth * 0.05,
    paddingVertical: fixwidth * 0.022,
    borderRadius: fixwidth * 0.017,
    borderWidth: fixwidth * 0.005,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  text: {
    fontSize: fixwidth * 0.036,
    color: 'rgba(0,0,0,0.44)',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.06,
    textAlign: 'center',

  },
});
