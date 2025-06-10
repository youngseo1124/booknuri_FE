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
  const [lifeBookOnly, setLifeBookOnly] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState('');

  // 🔁 백업용
  const [prevStatus, setPrevStatus] = useState(null);
  const [prevLifeBookOnly, setPrevLifeBookOnly] = useState(false);

  const fetchShelfBooks = useCallback(async () => {
    const data = await getMyShelfBooks(0, 10, selectedStatus, lifeBookOnly, keyword);
    setBookList(data.content || []);
    setTotalCount(data.totalCount || 0);
    setPage(1);
    setHasMore((data.content || []).length === 10);
  }, [selectedStatus, lifeBookOnly, keyword]);

  useFocusEffect(
    useCallback(() => {
      fetchShelfBooks();
    }, [fetchShelfBooks])
  );

  const fetchNextPage = async () => {
    if (!hasMore) return;
    try {
      const data = await getMyShelfBooks(page, 10, selectedStatus, lifeBookOnly, keyword);
      setBookList((prev) => {
        const newBooks = data.content || [];
        const merged = [...prev, ...newBooks];
        const uniqueBooksMap = new Map();
        merged.forEach((book) => {
          uniqueBooksMap.set(book.shelfInfo.isbn13, book);
        });
        return Array.from(uniqueBooksMap.values());
      });
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
      {filterVisible && <View style={styles.overlayBackground} />}

      <ShelfFilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        lifeBookOnly={lifeBookOnly}
        setLifeBookOnly={setLifeBookOnly}
        onApply={(newStatus, newLifeBookOnly) => {
          setSelectedStatus(newStatus);
          setLifeBookOnly(newLifeBookOnly);
          setFilterVisible(false);
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
            onSettingPress={() => setFilterVisible(true)}
            onSearch={(keyword) => {
              setPrevStatus(selectedStatus);        // ✅ 필터 상태 백업
              setPrevLifeBookOnly(lifeBookOnly);
              setSelectedStatus(null);              // 필터 초기화
              setLifeBookOnly(false);
              setKeyword(keyword);                  // 키워드 설정
            }}
            onSearchCancel={() => {
              setKeyword('');                       // 검색 종료 시
              setSelectedStatus(prevStatus);        // ✅ 필터 복원
              setLifeBookOnly(prevLifeBookOnly);
            }}
            onFilterReset={() => {
              setSelectedStatus(null);
              setLifeBookOnly(false);
            }}
          />
        }
        ListFooterComponent={<VerticalGap height={parentWidth * 0.07} />}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
