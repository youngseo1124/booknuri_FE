import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';


const { width: fixwidth } = Dimensions.get('window');

// height를 props로 받아서 커스터마이징 가능

const DividerBlock = ({ height = fixwidth * 0.057 }) => {
  return <View style={[styles.divider, { height }]} />;
};

export default DividerBlock;

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    backgroundColor: '#f3f3f3',
  },
});
