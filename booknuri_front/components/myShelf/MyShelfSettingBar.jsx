import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const MyShelfSettingBar = ({ totalCount, selectedStatus, onStatusChange, onSearchPress }) => {
  const { width: fixwidth } = useWindowDimensions();

  const styles = getStyles(fixwidth);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.totalText}>총 {totalCount}권</Text>

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


const getStyles = (fixwidth) => StyleSheet.create({
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
    width: fixwidth * 0.057,
    height: fixwidth * 0.057,
    resizeMode: 'contain',
  },
});
