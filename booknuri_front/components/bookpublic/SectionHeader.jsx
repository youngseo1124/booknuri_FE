import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const SectionHeader = ({ label }) => {
  return (
    <View style={styles.labelWrapper}>
      {/* 아이콘은 원할 경우 prop으로 나중에 추가해도 됨! */}
      <Text style={styles.headlabel}>{label}</Text>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.025,
    paddingHorizontal: fixwidth * 0.015,
    marginBottom: fixwidth * 0.025,
  },
  headlabel: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.06,
  },
});
