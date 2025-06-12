import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import CustomMonthView from '../../components/calendar/CustomMonthView';
import { getMonthlyCalendarThumbnails } from '../../apis/apiFunction_calendar';
import { useShelf } from '../../contexts/ShelfContext';

const CalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [months, setMonths] = useState([]);
  const [monthlyThumbnails, setMonthlyThumbnails] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollReady, setScrollReady] = useState(false);
  const [ready, setReady] = useState(false);
  const { modifiedAt } = useShelf();

  // ✅ InteractionManager + setTimeout + insets.top 로딩 안정화
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
    }, 10);
  }, [insets.top]);

  const fetchMonthlyThumbnails = async (monthStr, force = false) => {
    if (!force && monthlyThumbnails[monthStr]) {
      console.log('📛 캐시 있음. 패스:', monthStr);
      return;
    }

    const [year, month] = monthStr.split('-').map(Number);
    const now = new Date();
    const targetDate = new Date(year, month - 1);

    if (targetDate > new Date(now.getFullYear(), now.getMonth())) {
      console.log('⏩ 미래 월. fetch 안함:', monthStr);
      return;
    }

    console.log('📡 API 호출 시작:', monthStr);

    try {
      const res = await getMonthlyCalendarThumbnails({ year, month });
      setMonthlyThumbnails((prev) => ({
        ...prev,
        [monthStr]: res.data.data,
      }));
      console.log('✅ API 응답 완료:', res.data.data);
    } catch (e) {
      console.error('❌ 썸네일 불러오기 실패:', e);
    }
  };



  useEffect(() => {
    if (!modifiedAt) return;

    const todayMonthStr = new Date().toISOString().slice(0, 7);
    console.log('📆 캘린더에서 modifiedAt 감지됨! 강제 fetch:', todayMonthStr);

    // ✅ 캐시 삭제 없이 강제 fetch 시도
    fetchMonthlyThumbnails(todayMonthStr, true);
  }, [modifiedAt]);




  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const todayMonthStr = today.toISOString().slice(0, 7);
    const monthList = [];

    for (let i = -9; i <= 2; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i);
      const monthStr = d.toISOString().slice(0, 7);
      monthList.push(monthStr);
      fetchMonthlyThumbnails(monthStr);
    }

    const idx = monthList.findIndex((m) => m === todayMonthStr);
    setSelectedDate(todayStr);
    setMonths(monthList);
    setCurrentIndex(idx);
  }, []);

  useEffect(() => {
    if (scrollReady && scrollRef.current && containerWidth > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: containerWidth * currentIndex,
          animated: false,
        });
      }, 0);
    }
  }, [scrollReady, containerWidth, currentIndex]);

  const handleScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / containerWidth);
    setCurrentIndex(index);
    const newMonthStr = months[index];
    fetchMonthlyThumbnails(newMonthStr);
  };

  const handleSelectDate = useCallback((dateStr) => {
    setSelectedDate(dateStr);
    navigation.navigate('DayDetailScreen', { date: dateStr });
  }, [navigation]);

  return (
    <>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {!ready ? (
          <View style={styles.fakeBackground} />
        ) : (
          <>
            <HomeHeader title="독서 캘린더" />
            <View
              style={{ flex: 1 }}
              onLayout={(e) => {
                const layoutWidth = e.nativeEvent.layout.width;
                setContainerWidth(layoutWidth);
                setScrollReady(true);
              }}
            >
              {containerWidth > 0 && (
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEnd}
                >
                  {months.map((monthStr) => {
                    const isSameMonth = selectedDate.slice(0, 7) === monthStr;
                    return (
                      <View key={monthStr} style={{ width: containerWidth }}>
                        <CustomMonthView
                          month={monthStr}
                          selectedDate={isSameMonth ? selectedDate : ''}
                          onSelectDate={handleSelectDate}
                          parentWidth={containerWidth}
                          thumbnailMap={monthlyThumbnails[monthStr] || {}}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fakeBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
