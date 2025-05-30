
import React from 'react';
import { View, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const VerticalGap = ({ height = fixwidth * 0.01 }) => {
  return <View style={{ height }} />;
};

export default VerticalGap;
