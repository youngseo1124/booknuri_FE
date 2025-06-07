import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList
} from 'react-native';
import {
  getBestsellerBooks,
  getMainCategoryList
} from '../../apis/apiFunction_recommend';
import SectionHeaderWithIcon from '../public/publicHeader/SectionHeaderWithIcon';
import VerticalGap from '../public/publicUtil/VerticalGap';
import BookSuggestionCarousel from '../public/bookpublic/BookSuggestionCarousel';
import CategorySelector from '../public/publicButton/CategorySelector';

const { width: fixwidth } = Dimensions.get('window');

const periods = [
  { label: '주간', value: 'weekly' },
  { label: '월간', value: 'monthly' },
  { label: '연간', value: 'yearly' },
];

const BestsellerRecommendationBlock = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [carouselResetKey, setCarouselResetKey] = useState(0);
  const [bookList, setBookList] = useState([]);

  // 카테고리 목록 불러오기
  useEffect(() => {
    getMainCategoryList()
      .then(res => setCategoryList(res.data || []))
      .catch(err => console.error('🔥 카테고리 로드 실패:', err));
  }, []);

  // 기간 or 카테고리 변경 시 도서 추천 다시 불러오기
  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      try {
        const res = await getBestsellerBooks({
          period: selectedPeriod,
          mainCategoryId: selectedCategory ?? undefined,
        });
        if (!ignore) {
          setBookList(res.data);
          setCarouselResetKey(prev => prev + 1);
        }
      } catch (e) {
        console.error('🔥 베스트셀러 불러오기 실패:', e);
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [selectedPeriod, selectedCategory]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SectionHeaderWithIcon label="베스트 셀러" />
      <VerticalGap height={fixwidth * 0.02} />

      <View style={styles.periodButtonRow}>
        {periods.map((p, idx) => (
          <TouchableOpacity
            key={p.value}
            onPress={() => setSelectedPeriod(p.value)}
            style={[
              styles.periodBtn,
              selectedPeriod === p.value && styles.periodBtnSelected,
              { marginRight: idx !== periods.length - 1 ? fixwidth * 0.02 : 0 },
            ]}
          >
            <Text
              style={[
                styles.periodBtnText,
                selectedPeriod === p.value && styles.periodBtnTextSelected,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
        <CategorySelector
          selectedCategory={selectedCategory}
          categoryList={categoryList}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <VerticalGap height={fixwidth * 0.03} />

      <BookSuggestionCarousel
        key={carouselResetKey}
        books={bookList}
        booksPerPage={5}
        maxPage={4}
        thumbnailWidth={fixwidth * 0.22}
        thumbnailHeight={fixwidth * 0.3}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPressOut={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalBox}>
            <FlatList
              data={[{ id: null, name: '전체' }, ...categoryList]}
              keyExtractor={(item) => item.id?.toString() || 'all'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategorySelect(item.id)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default BestsellerRecommendationBlock;

const styles = StyleSheet.create({
  container: {
    width: '94%',
    alignSelf: 'center',
  },
  periodButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.014,
    gap: fixwidth * 0.037,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: fixwidth * 0.017,
    borderRadius: fixwidth * 0.017,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginRight: fixwidth * 0.02,
  },
  periodBtnSelected: {
    backgroundColor: '#839bfd',
  },
  periodBtnText: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.047,
    color: '#333',
  },
  periodBtnTextSelected: {
    color: '#fff',
    fontFamily: 'NotoSansKR-Medium',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: fixwidth * 0.7,
    maxHeight: fixwidth * 1.2,
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.01,
    paddingHorizontal: fixwidth * 0.04,
  },
  modalItem: {
    paddingVertical: fixwidth * 0.03,
  },
  modalItemText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    color: '#111',
  },
});
