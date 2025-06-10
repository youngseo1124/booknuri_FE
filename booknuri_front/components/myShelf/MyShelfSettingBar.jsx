import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const MyShelfSettingBar = ({
                             totalCount,
                             onSearch,
                             onFilterReset,
                             onSettingPress,
                             onSearchCancel,
                           }) => {
  const { width: fixwidth } = useWindowDimensions();
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleSearchPress = () => {
    if (!searching) {
      setSearching(true);
    } else {
      onFilterReset();
      onSearch(keyword);
      Keyboard.dismiss();
    }
  };

  // 검색 모드 해제 시 → 필터 복원 알림
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (searching) {
        setSearching(false);
        setKeyword('');
        Keyboard.dismiss();
        onSearchCancel?.();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [searching]);

  const styles = getStyles(fixwidth);

  return (
    <View style={styles.wrapper}>
      {!searching && (
        <Text style={styles.totalText}>총 {totalCount}권</Text>
      )}

      <View style={styles.iconGroup}>
        {searching && (
          <TextInput
            placeholder="책 제목 검색"
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearchPress}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
        )}

        <TouchableOpacity onPress={handleSearchPress} style={styles.iconBtn}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={fixwidth * 0.0427}
            color="rgba(149,149,149,0.77)"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onSettingPress} style={styles.iconBtn}>
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

const getStyles = (fixwidth) =>
  StyleSheet.create({
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
      flex: 1,
      justifyContent: 'flex-end',
    },
    iconBtn: {
      paddingHorizontal: fixwidth * 0.017,
    },
    settingIcon: {
      width: fixwidth * 0.057,
      height: fixwidth * 0.057,
      resizeMode: 'contain',
    },
    searchInput: {
      flex: 1,
      backgroundColor: 'white',
      marginRight: fixwidth * 0.015,
      paddingHorizontal: fixwidth * 0.027,
      paddingVertical: fixwidth * 0.017,
      borderRadius: fixwidth * 0.02,
      fontSize: fixwidth * 0.035,
    },
  });
