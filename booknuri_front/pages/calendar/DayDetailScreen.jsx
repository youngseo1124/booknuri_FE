import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';

import { getDailyCalendarDetails } from '../../apis/apiFunction_calendar';
import MyShelfSettingBar from '../../components/myShelf/MyShelfSettingBar';
import BookSuggestionItem from '../../components/public/bookpublic/BookSuggestionItem';

const { width: fixwidth } = Dimensions.get('window');

const DayDetailScreen = ({ route }) => {
  const { date } = route.params; // "2025-06-11"
  const [data, setData] = useState(null);

  const getFormattedDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDailyCalendarDetails(date);
        setData(res.data);
      } catch (err) {
        console.error('❌ 일별 상세 조회 실패:', err);
      }
    };
    fetchData();
  }, [date]);

  if (!data) return null;

  // 중복 제거해서 총 n권 계산 (isbn13 기준)
  const allBooks = [...data.shelvedBooks, ...data.finishedBooks];
  const uniqueBooksMap = new Map();
  allBooks.forEach((book) => {
    if (!uniqueBooksMap.has(book.isbn13)) {
      uniqueBooksMap.set(book.isbn13, book);
    }
  });
  const totalCount = uniqueBooksMap.size;

  return (
    <CommonLayout>
      <Header title={getFormattedDate(date)} />
      <MyShelfSettingBar
        countLabel={`총 ${totalCount}권`}
        showSetting={false}
        showSearch={false}  // 🔥 검색 버튼 숨기기!
      />


      {/* 📚 책장에 담은 책 */}
      {data.shelvedBooks?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> 책장에 담은 책</Text>
          <FlatList
            data={data.shelvedBooks}
            keyExtractor={(item) => item.isbn13}
            renderItem={({ item }) => <BookSuggestionItem book={item} />}
          />
        </View>
      )}

      {/* ✅ 완독한 책 */}
      {data.finishedBooks?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> 완독한 책</Text>
          <FlatList
            data={data.finishedBooks}
            keyExtractor={(item) => item.isbn13}
            renderItem={({ item }) => <BookSuggestionItem book={item} />}
          />
        </View>
      )}
    </CommonLayout>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({
  section: {
    marginTop: fixwidth * 0.04,
    paddingHorizontal: fixwidth * 0.04,
  },
  sectionTitle: {
    fontSize: fixwidth * 0.04,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.0797,
    color: '#222',
  },
});
