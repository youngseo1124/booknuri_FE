import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ShelfTabSwitcher from '../../components/myShelf/ShelfTabSwitcher';
import MyShelfTabPage from '../../components/myShelf/MyShelfTabPage';
import MyHistoryTabPage from '../../components/myShelf/MyHistoryTabPage';

const { width: fixwidth } = Dimensions.get('window');

const MyShelfScreen = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleTabPress = (index) => {
    scrollRef.current?.scrollTo({ x: fixwidth * index, animated: true });
    setCurrentIndex(index);
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / fixwidth);
    setCurrentIndex(index);
  };

  return (
    <CommonLayout>
      <HomeHeader title="내 서재" />
      <ShelfTabSwitcher currentIndex={currentIndex} onTabPress={handleTabPress} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.page}><MyShelfTabPage /></View>
        <View style={styles.page}><MyHistoryTabPage /></View>
      </ScrollView>
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  page: {
    width: fixwidth,
  },
});

export default MyShelfScreen;
