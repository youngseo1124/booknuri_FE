import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, StyleSheet, Dimensions
} from 'react-native';
import { getDemographicRecommendations } from '../../apis/apiFunction_recommend';
import SectionHeaderWithIcon from '../public/publicHeader/SectionHeaderWithIcon';
import VerticalGap from '../public/publicUtil/VerticalGap';
import BookSuggestionCarousel from '../public/bookpublic/BookSuggestionCarousel';
import { LoginContext } from '../../contexts/LoginContextProvider';

const { width: fixwidth } = Dimensions.get('window');

const DemographicRecommendationBlock = () => {
  const { userInfo } = useContext(LoginContext);
  const [books, setBooks] = useState([]);

  const getAgeGroup = (birth) => {
    const birthYear = Math.floor(birth / 10000);
    const currentYear = new Date().getFullYear();
    return Math.floor((currentYear - birthYear) / 10) * 10; // ex: 2003 → 2025-2003 = 22 → 20대
  };

  useEffect(() => {
    if (userInfo) {
      const gender = userInfo.gender; // 'M' | 'F'
      const birthYearGroup = getAgeGroup(userInfo.birth);

      getDemographicRecommendations({ gender, birthYearGroup })
        .then((res) => setBooks(res.data || []))
        .catch((err) => console.error('🔥 성별/연령별 추천 실패:', err));
    }
  }, [userInfo]);

  const labelText = userInfo
    ? `${getAgeGroup(userInfo.birth)}대 ${userInfo.gender === 'F' ? '여성' : '남성'} 인기도서`
    : '인기도서';

  return (
    <View style={styles.container}>
      <SectionHeaderWithIcon label={labelText} />
      <VerticalGap height={fixwidth * 0.03} />

      <BookSuggestionCarousel
        books={books}
        booksPerPage={4}
        maxPage={4}
        thumbnailWidth={fixwidth * 0.22}
        thumbnailHeight={fixwidth * 0.3}
      />
    </View>
  );
};

export default DemographicRecommendationBlock;

const styles = StyleSheet.create({
  container: {
    width: '94%',
    alignSelf: 'center',
  },
});
