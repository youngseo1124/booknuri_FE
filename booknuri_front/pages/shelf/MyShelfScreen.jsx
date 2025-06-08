import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LoginContext } from '../../contexts/LoginContextProvider';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const MyShelfScreen = () => {
  const scrollRef = useRef(null);
  const { userInfo } = useContext(LoginContext);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 👇 여기에 서재 초기 데이터 불러오는 코드 추가하면 됨!
    const init = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // mock loading
        setIsReady(true);
      } catch (e) {
        console.error('서재 초기화 실패:', e);
      }
    };

    init();
  }, []);

  return (
    <CommonLayout>
      <HomeHeader title="내 서재" />

      {isReady ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <VerticalGap height={fixwidth * 0.04} />
            {/* 🔽 여기에 서재 콘텐츠들 추가 */}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      )}

      {isReady && (
        <ScrollToTopButton onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
      )}
    </CommonLayout>
  );
};

export default MyShelfScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: fixwidth * 0.01,
    paddingBottom: fixwidth * 0.27,
    backgroundColor: '#fff',
  },
  section: {
    width: '100%',
    paddingHorizontal: fixwidth * 0.03,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
