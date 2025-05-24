// 📦 components/firstSettingComponent/GenderSelectBox.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const GenderSelectBox = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.box, selected && styles.selectedBox]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: "97%",
    paddingVertical: fixwidth * 0.04,
    borderRadius: fixwidth * 0.02,
    backgroundColor: '#FBF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: fixwidth * 0.035,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedBox: {
    borderColor: '#FFA800',
    backgroundColor: '#FFF5E5',
  },
  text: {
    fontSize: fixwidth * 0.042,
    color: '#222',
    fontFamily: 'NanumGothic-Bold',
  },
  selectedText: {
    color: '#FFA800',
  },
});

export default GenderSelectBox;
