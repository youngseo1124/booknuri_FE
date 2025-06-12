import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  InteractionManager,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import ShelfTabSwitcher from '../../components/myShelf/ShelfTabSwitcher';
import MyShelfTabPage from '../../components/myShelf/page/MyShelfTabPage';
import MyHistoryTabPage from '../../components/myShelf/page/MyHistoryTabPage';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';

const MyShelfScreen = () => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const shelfScrollRef = useRef(null);
  const historyScrollRef = useRef(null);
  const [shelfScrollOffset, setShelfScrollOffset] = useState(0);
  const [historyScrollOffset, setHistoryScrollOffset] = useState(0);

  const [ready, setReady] = useState(false);

  // ✅ 렌더 지연 (InteractionManager + 타이머 + insets.top 확인)
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
    }, 10); // 또는 100ms 정도까지는 OK
  }, [insets.top]);

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
    <>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {!ready ? (
          <View style={styles.fakeBackground} />
        ) : (
          <View style={styles.container}>
            <HomeHeader title="내 서재" />
            <ShelfTabSwitcher currentIndex={currentIndex} onTabPress={handleTabPress} />
            <View style={styles.tabWrapper}>
              <View
                style={[
                  styles.tabContent,
                  {
                    opacity: currentIndex === 0 ? 1 : 0,
                    pointerEvents: currentIndex === 0 ? 'auto' : 'none',
                  },
                ]}
              >
                <MyShelfTabPage
                  scrollRef={shelfScrollRef}
                  scrollOffsetY={shelfScrollOffset}
                  setScrollOffsetY={setShelfScrollOffset}
                  parentWidth={null}
                />
              </View>

              <View
                style={[
                  styles.tabContent,
                  {
                    opacity: currentIndex === 1 ? 1 : 0,
                    pointerEvents: currentIndex === 1 ? 'auto' : 'none',
                  },
                ]}
              >
                <MyHistoryTabPage
                  scrollRef={historyScrollRef}
                  scrollOffsetY={historyScrollOffset}
                  setScrollOffsetY={setHistoryScrollOffset}
                  parentWidth={null}
                />
              </View>
            </View>

            <ScrollToTopButton onPress={handleScrollToTop} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

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
  },
  tabWrapper: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MyShelfScreen;
