import React, {useEffect, useState} from 'react';
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
 * 📚 책장 전용 검색/필터 바
 */
const MyShelfSettingBar_two = ({
                                 totalCount,
                                 keyword,
                                 setKeyword,
                                 searching,
                                 setSearching,
                                 onSearch,
                                 onFilterReset,
                                 onSettingPress,
                                 onSearchCancel,
                               }) => {
  const { width: fixwidth } = useWindowDimensions();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchPress = () => {
    if (!searching) {
      setSearching(true);
    } else {
      onFilterReset?.();
      onSearch?.(); // 부모에서 keyword 참조함
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
      {!searching && <Text style={styles.totalText}>총 {totalCount}권</Text>}

      <View style={styles.iconGroup}>
        {searching && (
          <TextInput
            placeholder="책 제목 검색"
            placeholderTextColor="#888"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              setHasSearched(true); // ✅ 한 번 검색했으니 포커스 안 주기
              handleSearchPress();
            }}
            style={styles.searchInput}
            returnKeyType="search"
            autoFocus={!hasSearched} // ✅ 처음엔 true, 이후엔 false
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

export default MyShelfSettingBar_two;

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
