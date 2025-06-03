import React from 'react';
import { TextInput, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const OCRTextBox = ({ value }) => {
  return (
    <TextInput
      multiline
      value={value}
      editable={false}
      style={styles.box}
    />
  );
};

export default OCRTextBox;

const styles = StyleSheet.create({
  box: {
    height: fixwidth * 0.5,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    fontFamily: 'NotoSansKR-Regular',
    fontSize: fixwidth * 0.035,
    lineHeight: fixwidth * 0.05,
  },
});
