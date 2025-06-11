import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const FlatSegmentSelector = ({ options, selectedId, onSelect }) => {
  return (
    <View style={styles.row}>
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;

        return (
          <TouchableOpacity
            key={option.id ?? 'all'}
            style={[
              styles.button,
              index === 0 && styles.firstButton,
              isSelected && styles.selectedButton,
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Text
              style={[
                styles.text,
                isSelected && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FlatSegmentSelector;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: fixwidth * 0.02,
    borderWidth: fixwidth * 0.0017,
    borderColor: 'rgba(188,188,188,0.77)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: fixwidth * 0.0001,
  },
  firstButton: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    borderRightWidth: fixwidth*0.0037,
    backgroundColor: '#fff',
    borderColor: '#5494e0',
    borderWidth:fixwidth*0.00397
  },
  text: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight:fixwidth*0.037,
    color: '#444',
  },
  selectedText: {
    fontFamily: 'NotoSansKR-SemiBold',
    color: '#111',
  },
});
