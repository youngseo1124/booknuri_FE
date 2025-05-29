// screens/book/BookReviewListScreen.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import CommonLayout from '../../components/public/CommonLayout';
import Header from '../../components/public/Header';

const { width: fixwidth } = Dimensions.get('window');

const BookReviewListScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 여기서 getBookReviewList API 호출 예정
    const init = async () => {
      try {
        // await fetchReviews();
        await new Promise((r) => setTimeout(r, 150));
        setIsReady(true);
      } catch (err) {
        console.error('리뷰 전체 페이지 초기화 실패:', err);
      }
    };

    init();
  }, [isbn13]);

  if (!isReady) {
    return (
      <CommonLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header title="리뷰 상세 페이지" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* 여기에 리뷰 리스트 컴포넌트 삽입할 예정 */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </CommonLayout>
  );
};

export default BookReviewListScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: fixwidth * 0.04,
    paddingHorizontal: fixwidth * 0.06,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
