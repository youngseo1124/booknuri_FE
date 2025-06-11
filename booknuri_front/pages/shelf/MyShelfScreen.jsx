import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ 요거 추가!

import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ShelfTabSwitcher from '../../components/myShelf/ShelfTabSwitcher';
import MyShelfTabPage from '../../components/myShelf/page/MyShelfTabPage';
import MyHistoryTabPage from '../../components/myShelf/page/MyHistoryTabPage';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';

const MyShelfScreen = () => {
  const insets = useSafeAreaInsets(); // ✅ 요거 추가!
  const [currentIndex, setCurrentIndex] = useState(0);

  const shelfScrollRef = useRef(null);
  const historyScrollRef = useRef(null);
  const [shelfScrollOffset, setShelfScrollOffset] = useState(0);
  const [historyScrollOffset, setHistoryScrollOffset] = useState(0);

  const handleTabPress = (index) => {
    setCurrentIndex(index);
  };

  const handleScrollToTop = () => {
    if (currentIndex === 0) {
      shelfScrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    } else if (currentIndex === 1) {
      historyScrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <HomeHeader title="내 서재" />
      <ShelfTabSwitcher currentIndex={currentIndex} onTabPress={handleTabPress} />

      <View style={{ flex: 1 }}>
        {currentIndex === 0 && (
          <MyShelfTabPage
            scrollRef={shelfScrollRef}
            scrollOffsetY={shelfScrollOffset}
            setScrollOffsetY={setShelfScrollOffset}
            parentWidth={null}
          />
        )}
        {currentIndex === 1 && (
          <MyHistoryTabPage
            scrollRef={historyScrollRef}
            scrollOffsetY={historyScrollOffset}
            setScrollOffsetY={setHistoryScrollOffset}
            parentWidth={null}
          />
        )}
      </View>

      <ScrollToTopButton onPress={handleScrollToTop} />
    </View>
  );
};

export default MyShelfScreen;
