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

  // ✅ 각 탭의 내부 ScrollView ref
  const shelfScrollRef = useRef(null);
  const historyScrollRef = useRef(null);

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

  // 현재 탭에 따라 스크롤 위로
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
          <>
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
                <MyShelfTabPage parentWidth={containerWidth} scrollRef={shelfScrollRef} />
              </View>
              <View style={{ width: containerWidth }}>
                <MyHistoryTabPage parentWidth={containerWidth} scrollRef={historyScrollRef} />
              </View>
            </ScrollView>

          </>
        )}
      </View>

      {/* 상단으로 이동 버튼 */}
      <ScrollToTopButton onPress={handleScrollToTop} />
    </CommonLayout>
  );
};

export default MyShelfScreen;
