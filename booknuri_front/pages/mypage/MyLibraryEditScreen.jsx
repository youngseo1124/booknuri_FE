import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  InteractionManager,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginContext } from '../../contexts/LoginContextProvider';
import { setMyLibrary, userinfo } from '../../apis/apiFunction';

import Header from '../../components/public/publicHeader/Header';
import LibraryFilter from '../../components/userSetting/librarySetting/LibraryFilter';
import LibraryList from '../../components/userSetting/librarySetting/LibraryList';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import {navigationRef, reset} from '../../navigation/RootNavigation';

const { width: fixwidth } = Dimensions.get('window');

const MyLibraryEditScreen = () => {
  const { userInfo, setUserInfo } = useContext(LoginContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [filter, setFilter] = useState({});
  const [ready, setReady] = useState(false);

  const [showPopup, setShowPopup] = useState(false); // ✅ 팝업 표시 여부

  // ✅ 렌더 지연 처리
  useEffect(() => {
    let interactionDone = false;
    let delayDone = false;

    const maybeReady = () => {
      if (insets.top > 0 && interactionDone && delayDone) {
        setReady(true);
      }
    };

    InteractionManager.runAfterInteractions(() => {
      interactionDone = true;
      maybeReady();
    });

    setTimeout(() => {
      delayDone = true;
      maybeReady();
    }, 30);
  }, [insets.top]);

  // ✅ 기본 선택 도서관 설정
  useEffect(() => {
  }, [userInfo]);

  // ✅ 변경 요청 실행
  const confirmChange = async () => {
    try {
      const res = await setMyLibrary(selectedLibrary.libCode);
      if (res.status === 200) {
        const userRes = await userinfo();
        setUserInfo(userRes.data);
        reset('MainTab'); // 일단 TabNavigator로 이동한 다음,
        setTimeout(() => {
          navigationRef.navigate('HomeTab'); // TabNavigator 내부의 HomeTab으로 이동
        }, 100); // navigationRef가 MainTab까지 이동하고 나서 tab 이동 (약간의 딜레이 필요)

      }
    } catch (err) {
      console.error('❌ 도서관 변경 실패', err);
    }
  };

  return (
    <>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {!ready ? (
          <View style={styles.fakeBackground} />
        ) : (
          <View style={styles.container}>
            <Header title="내 도서관 설정" style={styles.absoluteHeader} />

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={{ paddingTop: fixwidth * 0.0, paddingBottom: fixwidth * 0.2 }}
              showsVerticalScrollIndicator={false}
            >
              <LibraryFilter setFilter={setFilter} />
              <LibraryList
                filter={filter}
                selectedLibrary={selectedLibrary}
                onSelectLibrary={setSelectedLibrary}
              />
            </ScrollView>

            <FixedBottomButton
              label="도서관 변경하기"
              onPress={() => setShowPopup(true)} //  팝업 띄우기
              disabled={!selectedLibrary}
              bottomInset={insets.bottom}
              style={styles.absoluteButton}
            />
          </View>
        )}
      </SafeAreaView>

      {/* ✅ 팝업 컴포넌트 추가 */}
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
  fakeBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
    width: '93%',
    alignSelf: 'center',
  },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  absoluteButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
