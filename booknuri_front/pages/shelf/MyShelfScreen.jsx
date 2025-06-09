import React, {useCallback, useRef, useState} from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ShelfTabSwitcher from '../../components/myShelf/ShelfTabSwitcher';
import MyShelfTabPage from '../../components/myShelf/page/MyShelfTabPage';
import MyHistoryTabPage from '../../components/myShelf/page/MyHistoryTabPage';
import {useFocusEffect} from '@react-navigation/native';

const MyShelfScreen = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(null); // ✅ 실측 너비



  const handleTabPress = (index) => {
    if (containerWidth !== null) {
      scrollRef.current?.scrollTo({ x: containerWidth * index, animated: true });
      setCurrentIndex(index);
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    setCurrentIndex(index);
  };

  return (
    <CommonLayout>
      <HomeHeader title="내 서재" />
      <ShelfTabSwitcher currentIndex={currentIndex} onTabPress={handleTabPress} />

      <View
        style={{ flex: 1 }}
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {containerWidth !== null && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={handleScroll}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View style={{ width: containerWidth }}>
              <MyShelfTabPage parentWidth={containerWidth} />
            </View>
            <View style={{ width: containerWidth }}>
              <MyHistoryTabPage parentWidth={containerWidth} />
            </View>
          </ScrollView>
        )}
      </View>
    </CommonLayout>
  );
};


export default MyShelfScreen;
