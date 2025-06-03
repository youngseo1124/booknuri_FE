import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // ✅ 네모 체크박스 아이콘 사용

const { width: fixwidth } = Dimensions.get('window');

const JoinCheckBox = ({ label, value, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!value)}
      activeOpacity={0.7}
    >
      <Icon
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={fixwidth * 0.067}
        color={value ? 'rgba(97,156,245,0.95)' : '#ccc'}
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

export default JoinCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.01,
  },
  label: {
    fontSize: fixwidth * 0.0377,
    color: 'rgb(63,63,63)',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.05,
  },
});
