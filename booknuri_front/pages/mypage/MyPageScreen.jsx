import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  InteractionManager,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { RecentViewedBooksContext } from '../../contexts/RecentViewedBooksContextProvider';

import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import MyProfileHeader from '../../components/mypage/MyProfileHeader';
import RecentViewedBookBlock from '../../components/mypage/RecentViewedBookBlock';
import DividerBlock from '../../components/public/publicUtil/DividerBlock';
import SettingItem from '../../components/mypage/SettingItem';

const { width: fixwidth } = Dimensions.get('window');

const MyPageScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout } = useContext(LoginContext);
  const { recentBooks } = useContext(RecentViewedBooksContext);

  const [ready, setReady] = useState(false);

  // ✅ 렌더 지연 처리 (InteractionManager + 타이머 + insets.top 확인)
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
    }, 20);
  }, [insets.top]);

  if (!ready) {
    return <View style={styles.fakeBackground} />;
  }

  return (
    <>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <HomeHeader title="마이페이지" />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <MyProfileHeader />
            <DividerBlock />
            <RecentViewedBookBlock books={recentBooks} />
            <DividerBlock />

            {/* 👇 설정 항목 리스트 */}
            <SettingItem label="로그아웃" onPress={logout} />
            <SettingItem
              label="내 도서관 변경하기"
              onPress={() => navigation.navigate('MyLibraryEditScreen')}
            />
            <SettingItem label="생년월일 변경하기" onPress={() => {}} />
            <SettingItem label="튜토리얼 다시보기" onPress={() => {}} />
            <SettingItem label="문의하기" onPress={() => {}} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: fixwidth * 0.2,
  },
  fakeBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
