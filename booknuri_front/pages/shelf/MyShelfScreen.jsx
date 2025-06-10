import React, { useCallback, useRef, useState } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ShelfTabSwitcher from '../../components/myShelf/ShelfTabSwitcher';
import MyShelfTabPage from '../../components/myShelf/page/MyShelfTabPage';
import MyHistoryTabPage from '../../components/myShelf/page/MyHistoryTabPage';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';

const MyShelfScreen = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(null);

  // 각 탭의 FlatList ref
  const shelfScrollRef = useRef(null);
  const historyScrollRef = useRef(null);

  // 스크롤 위치 기억 (유지용)
  const [shelfScrollOffset, setShelfScrollOffset] = useState(0);
  const [historyScrollOffset, setHistoryScrollOffset] = useState(0);

  const handleTabPress = (index) => {
    console.log('📌 탭 변경됨! index:', index);
    console.log('🧷 현재 scrollOffsetY 상태:', {
      shelfScrollOffset,
      historyScrollOffset,
    });

    if (containerWidth !== null) {
      scrollRef.current?.scrollTo({ x: containerWidth * index, animated: true });
      setCurrentIndex(index);
    }
  };


  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
    setCurrentIndex(index);
  };

  // 상단 이동 버튼 누를 때
  const handleScrollToTop = () => {
    if (currentIndex === 0) {
      shelfScrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else if (currentIndex === 1) {
      historyScrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
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
            scrollEnabled={false}
          >
            <View style={{ width: containerWidth }}>
              <MyShelfTabPage
                parentWidth={containerWidth}
                scrollRef={shelfScrollRef}
                scrollOffsetY={shelfScrollOffset}
                setScrollOffsetY={setShelfScrollOffset}
              />
            </View>
            <View style={{ width: containerWidth }}>
              <MyHistoryTabPage
                parentWidth={containerWidth}
                scrollRef={historyScrollRef}
                scrollOffsetY={historyScrollOffset}
                setScrollOffsetY={setHistoryScrollOffset}
              />
            </View>
          </ScrollView>
        )}
      </View>

      <ScrollToTopButton onPress={handleScrollToTop} />
    </CommonLayout>
  );
};

export default MyShelfScreen;
