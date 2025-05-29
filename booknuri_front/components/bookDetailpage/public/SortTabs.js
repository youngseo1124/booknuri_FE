import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const SORT_OPTIONS = [
  { key: 'like', label: '공감순' },
  { key: 'new', label: '최신순' },
  { key: 'high', label: '별점 높은순' },
  { key: 'low', label: '별점 낮은순' },
];

const ReviewSortTabs = ({ currentSort, onChange }) => {
  return (
    <View style={styles.tabWrapper}>
      <View style={styles.tabContainer}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => onChange(option.key)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                currentSort === option.key && styles.activeText,
              ]}
            >
              {option.label}
            </Text>
            {currentSort === option.key && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ReviewSortTabs;

const styles = StyleSheet.create({
  tabWrapper: {
    width:"100%",
    borderBottomWidth: fixwidth * 0.0025,
    borderBottomColor: '#cfcfcf', // 연한 줄 (기본 divider 줄)
    marginBottom: fixwidth * 0.04,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: fixwidth * 0.025, // 💡 높이 통일
    position: 'relative', // underline absolute 배치용
  },
  tabText: {
    fontSize: fixwidth * 0.035,
    color: '#adadad',
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
