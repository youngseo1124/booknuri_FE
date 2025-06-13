import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginContext } from '../../contexts/LoginContextProvider';
import { setMyLibrary, userinfo } from '../../apis/apiFunction';

import Header from '../../components/public/publicHeader/Header';
import LibraryFilter from '../../components/userSetting/librarySetting/LibraryFilter';
import LibraryList from '../../components/userSetting/librarySetting/LibraryList';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import { navigationRef, reset } from '../../navigation/RootNavigation';

const { width: fixwidth } = Dimensions.get('window');

const MyLibraryEditScreen = () => {
  const { userInfo, setUserInfo } = useContext(LoginContext);
  const navigation = useNavigation();

  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [filter, setFilter] = useState({
    si: '',
    gu: '',
    keyword: ''
  });

  const [showPopup, setShowPopup] = useState(false);

  const confirmChange = async () => {
    try {
      const res = await setMyLibrary(selectedLibrary.libCode);
      if (res.status === 200) {
        const userRes = await userinfo();
        setUserInfo(userRes.data);
        reset('MainTab');
        setTimeout(() => {
          navigationRef.navigate('HomeTab');
        }, 100);
      }
    } catch (err) {
      console.error('❌ 도서관 변경 실패', err);
    }
  };

  return (
    <>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Header title="내 도서관 설정" style={styles.absoluteHeader} />

          {/* 여백 없이 바로 시작 */}
          <View style={styles.listWrapper}>
            <LibraryFilter setFilter={setFilter} />
            <LibraryList
              filter={filter}
              selectedLibrary={selectedLibrary}
              onSelectLibrary={setSelectedLibrary}
            />
          </View>

          <FixedBottomButton
            label="도서관 변경하기"
            onPress={() => setShowPopup(true)}
            disabled={!selectedLibrary}
            style={styles.absoluteButton}
          />
        </View>
      </SafeAreaView>

      <TitleOnlyPopup
        visible={showPopup}
        title="내 도서관을 변경하시겠습니까?"
        onConfirm={() => {
          setShowPopup(false);
          confirmChange();
        }}
        onCancel={() => setShowPopup(false)}
      />
    </>
  );
};

export default MyLibraryEditScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    width: '100%',
  },
  listWrapper: {
    flex: 1,
    paddingBottom: fixwidth * 0.15,
    width: '93%', // ✅ 가로 패딩 처리
    alignSelf: 'center',
  },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    width: '100%',
  },

});
