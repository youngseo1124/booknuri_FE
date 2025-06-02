import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const colorOptions = [
  '#000000', '#4D4D4D', '#808080', '#B3B3B3', '#D9D9D9', '#FFFFFF',
];

const QuoteFontColorSelector = ({ fontColor, onSelect }) => {
  return (
    <View style={styles.colorRow}>
      {colorOptions.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            fontColor === color && styles.selected,
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
};

export default QuoteFontColorSelector;

const styles = StyleSheet.create({
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: fixwidth * 0.04,
  },
  colorCircle: {
    width: fixwidth * 0.1,
    height: fixwidth * 0.1,
    borderRadius: fixwidth * 0.05,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selected: {
    borderColor: '#ff5500',
    borderWidth: 2,
  },
});
