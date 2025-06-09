import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CategorySelector from '../public/publicButton/CategorySelector'; // 기존꺼 재활용

const { width: fixwidth } = Dimensions.get('window');

const statusOptions = [
  { id: null, name: '전체' }, // 전체 필터
  { id: 'WANT_TO_READ', name: '읽고 싶은 책' },
  { id: 'READING', name: '읽고 있는 책' },
  { id: 'FINISHED', name: '완독한 책' },
];

const MyShelfSettingBar = ({ totalCount, selectedStatus, onStatusChange, onSearchPress }) => {
  return (
    <View style={styles.wrapper}>
      {/* 왼쪽: 총 권수 */}
      <Text style={styles.totalText}>총 {totalCount}권</Text>

      {/* 오른쪽: 아이콘 그룹 */}
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={fixwidth * 0.0427} color='rgba(149,149,149,0.77)'/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Image
            source={require('../../image/utill/setting_icon.png')}
            style={styles.settingIcon}
          />
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default MyShelfSettingBar;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.037,
    paddingVertical: fixwidth * 0.0177,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(214,214,214,0.27)',
  },
  totalText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.0457,
    color: '#111',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    paddingHorizontal: fixwidth * 0.017,
  },
  settingIcon: {
    paddingHorizontal: fixwidth * 0.017,
    width: fixwidth * 0.057,
    height: fixwidth * 0.057,
    resizeMode: 'contain',
  },
});
