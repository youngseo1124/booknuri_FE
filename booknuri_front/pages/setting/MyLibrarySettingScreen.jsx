import React, { useContext, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Dimensions, Text } from 'react-native';
import Header from '../../components/public/publicHeader/Header';

import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { setMyLibrary } from '../../apis/apiFunction';
import LibraryFilter from '../../components/userSetting/librarySetting/LibraryFilter';
import LibraryList from '../../components/userSetting/librarySetting/LibraryList';

const { width: fixwidth } = Dimensions.get("window");

const MyLibrarySettingScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { userInfo, setUserInfo } = useContext(LoginContext);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [filter, setFilter] = useState({});

  const goNext = async () => {
    if (!selectedLibrary) return;
    try {
      const res = await setMyLibrary(selectedLibrary.libCode);
      if (res.status === 200) {
        setUserInfo({ ...userInfo, myLibrary: selectedLibrary });
        navigation.navigate('HomeScreen');
      }
    } catch (err) {
      console.error('❌ 도서관 설정 실패', err);
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: width * 0.0 }]}>
      <Header title="내 도서관 설정" />
      <View style={styles.contentWrapper}>
        {/*<Text style={styles.guideText}>
          자주 찾는 도서관을 설정해 주세요.{'\n'}
          인기 책, 대출 여부 등 다양한 서비스를 빠르게 확인할 수 있어요!
        </Text>
*/}
        <LibraryFilter setSelectedLibrary={setSelectedLibrary} setFilter={setFilter} />
        <LibraryList filter={filter} onSelectLibrary={setSelectedLibrary} selectedLibrary={selectedLibrary} />
      </View>

      <FixedBottomButton label="다음" onPress={goNext} disabled={!selectedLibrary} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: {
    flex: 1,
    paddingVertical: fixwidth * 0.01,
  },

  guideText: {
    fontSize: fixwidth * 0.04,
    color: '#444',
    lineHeight: fixwidth * 0.06,
    marginVertical: fixwidth * 0.03,
    marginHorizontal: fixwidth * 0.015,
    backgroundColor: '#f3f3f3',
    padding: fixwidth * 0.03,
    borderRadius: fixwidth * 0.02,
    textAlign: 'center',
  },
});

export default MyLibrarySettingScreen;
