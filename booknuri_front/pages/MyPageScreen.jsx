import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginContext } from '../contexts/LoginContextProvider';
import CommonLayout from '../components/public/publicUtil/CommonLayout';
import HomeHeader from '../components/public/publicHeader/HomeHeader';
import MyProfileHeader from '../components/mypage/MyProfileHeader';

import { getRecentViewedBooks } from '../apis/apiFunction_mypage';
import RecentViewedBookBlock from '../components/mypage/RecentViewedBookBlock';
import DividerBlock from '../components/public/publicUtil/DividerBlock';
import SettingItem from '../components/mypage/SettingItem';

const { width: fixwidth } = Dimensions.get("window");

const MyPageScreen = () => {
  const { logout } = useContext(LoginContext);
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const res = await getRecentViewedBooks();
        setRecentBooks(res.data || []);
      } catch (err) {
        console.error('최근 본 책 불러오기 실패 ❌', err);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <CommonLayout>
      <HomeHeader title="마이페이지" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MyProfileHeader />
        <DividerBlock/>
        <RecentViewedBookBlock books={recentBooks} />
        <DividerBlock/>

        {/* 👇 설정 항목 리스트 */}
        <SettingItem label="로그아웃" onPress={logout} />
        <SettingItem label="내 도서관 변경하기" onPress={() => { /* TODO: navigation */ }} />
        <SettingItem label="생년월일 변경하기" onPress={() => { /* TODO: navigation */ }} />
        <SettingItem label="튜토리얼 다시보기" onPress={() => { /* TODO: navigation */ }} />
        <SettingItem label="문의하기" onPress={() => { /* TODO: navigation */ }} />
      </ScrollView>
    </CommonLayout>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: fixwidth * 0.2,
  },
});
