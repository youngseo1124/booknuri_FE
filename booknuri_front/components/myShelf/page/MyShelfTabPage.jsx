import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
} from 'react-native';

import ShelfBookCard from '../ShelfBookCard';
import { getMyShelfBooks } from '../../../apis/apiFunction_myShelf';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import MyShelfSettingBar from '../MyShelfSettingBar';
import { useFocusEffect } from '@react-navigation/native';
import ShelfFilterBottomSheet from '../ShelfFilterBottomSheet';

const MyShelfTabPage = ({ parentWidth, scrollRef }) => {
  const [bookList, setBookList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [lifeBookOnly, setLifeBookOnly] = useState(false); // ✅ 인생책 필터
  const [filterVisible, setFilterVisible] = useState(false); // ✅ 바텀시트 열림 여부
  const [totalCount, setTotalCount] = useState(0);


  const fetchShelfBooks = useCallback(async () => {
    const data = await getMyShelfBooks(0, 10, selectedStatus, lifeBookOnly);
    setBookList(data.content || []);
    setTotalCount(data.totalCount || 0);
    setPage(1);
    setHasMore((data.content || []).length === 10);
  }, [selectedStatus, lifeBookOnly]);


  useFocusEffect(
    useCallback(() => {
      fetchShelfBooks();

    }, [fetchShelfBooks])
  );


  const fetchNextPage = async () => {
    if (!hasMore) return;
    try {
      const data = await getMyShelfBooks(page, 10, selectedStatus, lifeBookOnly);
      setBookList((prev) => [...prev, ...(data.content || [])]);
      setPage((prev) => prev + 1);
      setHasMore((data.content || []).length === 10);
    } catch (err) {
      console.error('다음 페이지 불러오기 실패:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShelfBooks();
    setRefreshing(false);
  };

  const handleUpdateShelfBookStatus = (isbn13, newStatus) => {
    setBookList((prev) =>
      prev.map((book) =>
        book.shelfInfo.isbn13 === isbn13
          ? {
            ...book,
            shelfInfo: {
              ...book.shelfInfo,
              status: newStatus,
            },
          }
          : book
      )
    );
  };

  const styles = getStyles(parentWidth);

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/*  바텀시트 열릴 때만 반투명 오버레이 */}
      {filterVisible && (
        <View style={styles.overlayBackground} />
      )}

      <ShelfFilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        lifeBookOnly={lifeBookOnly}
        setLifeBookOnly={setLifeBookOnly}
        onApply={(newStatus, newLifeBookOnly) => {
          console.log('[📌 MyShelfTabPage] onApply:', newStatus, newLifeBookOnly);
          setSelectedStatus(newStatus);        // 새 필터값 설정
          setLifeBookOnly(newLifeBookOnly);    // 인생책 여부 설정
          setFilterVisible(false);             //  모달 닫기

        }}
      />

      <FlatList
        data={bookList}
        ref={scrollRef}
        keyExtractor={(item) => item.shelfInfo.isbn13}
        renderItem={({ item }) => (
          <ShelfBookCard
            book={item}
            parentWidth={parentWidth}
            onStatusUpdate={handleUpdateShelfBookStatus}
          />
        )}
        ListHeaderComponent={
          <MyShelfSettingBar
            totalCount={totalCount}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onSearchPress={() => console.log('검색')}
            onSettingPress={() => setFilterVisible(true)} // ✅ 버튼 누르면 열기
            parentWidth={parentWidth}
          />
        }
        ListFooterComponent={<VerticalGap height={parentWidth * 0.07} />}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={
          <Text style={styles.emptyText}>책장에 추가된 책이 없습니다 📚</Text>
        }
      />
    </View>
  );
};

export default MyShelfTabPage;

const getStyles = (width) =>
  StyleSheet.create({
    container: {
      paddingTop: width * 0.01,
      paddingBottom: width * 0.07,
      paddingHorizontal: width * 0.007,
    },
    emptyText: {
      fontSize: width * 0.035,
      textAlign: 'center',
      marginTop: width * 0.2,
      fontFamily: 'NotoSansKR-Regular',
    },
    overlayBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.17)',
      zIndex: 9,
    },
  });
