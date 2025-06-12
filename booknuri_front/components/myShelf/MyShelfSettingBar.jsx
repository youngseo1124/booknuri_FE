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

/**
 * ✅ 공통 검색/설정 바 (책장, 내 기록 등에서 사용)
 *
 * @param {string} countLabel - 왼쪽 상단 텍스트 (예: '총 3권', '인용 5권' 등)
 * @param {function} onSearch - 검색 실행 시 (키워드 입력 후 엔터)
 * @param {function} onSearchCancel - 검색 종료 시
 * @param {function} onFilterReset - 검색 이전 필터 복원용
 * @param {function} onSettingPress - 설정 버튼 클릭 시 실행
 * @param {boolean} showSetting - 설정 아이콘 보일지 여부 (기본 true)
 */
const MyShelfSettingBar = ({
                             countLabel = '총 0권',
                             onSearch,
                             onSearchCancel,
                             onFilterReset,
                             onSettingPress,
                             showSetting = true,
                             showSearch = true, // ✅ 검색 버튼 보이기 여부 (기본값 true)
                           }) => {
  const { width: fixwidth } = useWindowDimensions();
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleSearchPress = () => {
    if (!searching) {
      setSearching(true);
    } else {
      onSearch?.(keyword);
      Keyboard.dismiss();
    }
  };

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
        <Text style={styles.totalText}>{countLabel}</Text>
      )}

      <View style={styles.iconGroup}>
        {showSearch && searching && (
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

        {showSearch && (
          <TouchableOpacity onPress={handleSearchPress} style={styles.iconBtn}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={fixwidth * 0.0427}
              color="rgba(149,149,149,0.77)"
            />
          </TouchableOpacity>
        )}

        {showSetting && (
          <TouchableOpacity onPress={onSettingPress} style={styles.iconBtn}>
            <Image
              source={require('../../image/utill/setting_icon.png')}
              style={styles.settingIcon}
            />
          </TouchableOpacity>
        )}
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
      justifyContent: 'space-between',
      backgroundColor: 'rgba(214,214,214,0.27)',
      height:fixwidth*0.09
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
      marginRight: fixwidth * 0.011,
      paddingHorizontal: fixwidth * 0.027,
      paddingVertical: fixwidth * 0.01,
      borderRadius: fixwidth * 0.007,
      fontSize: fixwidth * 0.037,
    },
  });
