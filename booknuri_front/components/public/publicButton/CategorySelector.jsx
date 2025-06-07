import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const CategorySelector = ({ selectedCategory, categoryList, onPress }) => {
  const selectedLabel = selectedCategory
    ? categoryList.find((c) => c.id === selectedCategory)?.name || '전체'
    : '전체';

  return (
    <TouchableOpacity
      style={styles.sortItem}
      onPress={onPress}
      activeOpacity={0.77}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.sortItemText}>{selectedLabel}</Text>
        <FontAwesomeIcon
          icon={faChevronDown}
          size={fixwidth * 0.035}
          color="#333"
          style={{ marginLeft: fixwidth * 0.01 }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  sortItem: {
    paddingHorizontal: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.017,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: fixwidth * 0.017,
    borderWidth: fixwidth * 0.001,
    borderColor: 'rgba(0,0,0,0.57)',
  },
  sortItemText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    lineHeight: fixwidth * 0.051,
  },
});
