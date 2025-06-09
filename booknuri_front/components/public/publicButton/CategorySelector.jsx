import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const CategorySelector = ({
                            selectedCategory,
                            categoryList,
                            onPress,
                            fontSize = fixwidth * 0.035,        // 기본값
                            lineHeight = fixwidth * 0.05,       // 기본값
                            borderRadius = fixwidth * 0.017,
                          }) => {
  const selectedLabel = selectedCategory
    ? categoryList.find((c) => c.id === selectedCategory)?.name || '전체'
    : '전체';

  return (
    <TouchableOpacity
      style={[styles.sortItem, { borderRadius }]}
      onPress={onPress}
      activeOpacity={0.77}
    >
      <View style={styles.sortItemInner}>
        <Text style={[styles.sortItemText, { fontSize, lineHeight }]}>
          {selectedLabel}
        </Text>
        <FontAwesomeIcon
          icon={faChevronDown}
          size={fixwidth * 0.035}
          color="#333"
        />
      </View>
    </TouchableOpacity>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  sortItem: {
    paddingHorizontal: fixwidth * 0.0277,
    paddingVertical: fixwidth * 0.016,
    backgroundColor: '#ffffff',
    borderWidth: fixwidth * 0.0027,
    borderColor: 'rgba(48,48,48,0.207)',
  },
  sortItemInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sortItemText: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
    // fontSize, lineHeight은 props로 override
  },
});
