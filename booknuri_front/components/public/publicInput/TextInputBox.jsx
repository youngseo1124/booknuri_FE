
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const TextInputBox = ({
                        placeholder = '리뷰를 작성하세요',
                        maxLength = 100,
                        inputHeight = fixwidth * 0.5,
                        value,
                        onChangeText,
                      }) => {
  const [textLength, setTextLength] = useState(value?.length || 0);

  useEffect(() => {
    setTextLength(value?.length || 0);
  }, [value]);

  const handleChange = (text) => {
    setTextLength(text.length);
    onChangeText && onChangeText(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.inputBox, { height: inputHeight }]}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChangeText={handleChange}
        multiline
      />
      <Text style={styles.countText}>
        {textLength}/{maxLength}
      </Text>
    </View>
  );
};

export default TextInputBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: fixwidth * 0.00,
    position: 'relative',
  },
  inputBox: {
    width: '100%',
    padding: fixwidth * 0.037,
    paddingBottom: fixwidth * 0.09, // 글자수 띄울 공간
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.02,
    textAlignVertical: 'top',
    fontSize: fixwidth * 0.04,
    borderWidth: fixwidth * 0.0047,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  countText: {
    position: 'absolute',
    bottom: fixwidth * 0.025,
    right: fixwidth * 0.03,
    color: '#999',
    fontSize: fixwidth * 0.03,
  },
});
