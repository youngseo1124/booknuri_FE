// components/review/TitleInputBox.jsx

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const InputBox = ({
                         placeholder = '제목을 입력하세요',
                         maxLength = 50,
                         inputHeight = fixwidth * 0.15,
                         value,
                         onChangeText,
                       }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.inputBox, { height: inputHeight }]}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputBox: {
    width: '100%',
    padding: fixwidth * 0.02,
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.02,
    textAlignVertical: 'top',
    fontSize: fixwidth * 0.04,
    borderWidth: fixwidth * 0.0047,
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: fixwidth * 0.037,
  },
});
