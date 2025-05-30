import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ✅ 네모 체크박스 아이콘 사용

const { width: fixwidth } = Dimensions.get('window');

const IconCheckBox = ({ label, value, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!value)}
      activeOpacity={0.7}
    >
      <Icon
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={fixwidth * 0.06}
        color={value ? 'rgba(97,156,245,0.95)' : '#ccc'}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.01,
  },
  label: {
    fontSize: fixwidth * 0.035,
    color: 'rgba(17,17,17,0.55)',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.05,
  },
});
