import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const ShelfTabSwitcher = ({ currentIndex, onTabPress }) => {
  const tabs = ['내 책장', '내 기록'];

  return (
    <View style={styles.container}>
      {tabs.map((label, idx) => (
        <TouchableOpacity
          key={label}
          style={styles.tab}
          onPress={() => onTabPress(idx)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.text,
              currentIndex === idx && styles.activeText,
            ]}
          >
            {label}
          </Text>
          {/* 회색 기본 밑줄 */}
          <View style={styles.inactiveUnderline} />
          {/* 활성화 밑줄만 조건부 렌더링 */}
          {currentIndex === idx && <View style={styles.activeUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: fixwidth * 0.027,
    position: 'relative',
  },
  text: {
    fontSize: fixwidth * 0.038,
    lineHeight: fixwidth * 0.05,
    fontFamily: 'NotoSansKR-Bold',
    color: 'rgba(60,60,60,0.35)',
  },
  activeText: {
    color: '#000',
    fontFamily: 'NotoSansKR-Bold',
  },
  inactiveUnderline: {
    position: 'absolute',
    bottom: 0,
    height: fixwidth * 0.007,
    backgroundColor: 'rgba(58,58,58,0.17)',
    width: '100%',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    height: fixwidth * 0.007,
    backgroundColor: '#80aee5', // 파란색
    width: '100%',
  },
});

export default ShelfTabSwitcher;
