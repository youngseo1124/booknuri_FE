import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const DEFAULT_SORT_OPTIONS = {
  like: '공감순',
  new: '최신순',
  high: '별점 높은순',
  low: '별점 낮은순',
};

const DEFAULT_VISIBLE_OPTIONS = ['like', 'new', 'high', 'low']; // ✅ 디폴트 설정

const SortTabs = ({
                    currentSort,
                    onChange,
                    visibleOptions = DEFAULT_VISIBLE_OPTIONS, // ✅ 안 주면 리뷰용 기본
                  }) => {
  return (
    <View style={styles.tabWrapper}>
      <View style={styles.tabContainer}>
        {visibleOptions.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                currentSort === key && styles.activeText,
              ]}
            >
              {DEFAULT_SORT_OPTIONS[key]}
            </Text>
            {currentSort === key && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};



export default SortTabs;

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
