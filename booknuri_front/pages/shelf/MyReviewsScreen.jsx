import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert, // React Native의 Alert 추가
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import MyBookReviewItem from '../../components/myShelf/MyBookReviewItem';
import AlertPopup from '../../components/public/publicPopup_Alert_etc/AlertPopup';
import { deleteReview, getMyReviewByIsbn, toggleLikeReview } from '../../apis/apiFunction_book';
import FixedBottomButton from '../../components/public/publicButton/FixedBottomButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';



const { width: fixwidth, height } = Dimensions.get('window');

const MyReviewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isbn13 } = route.params;

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);


  const handleWritePress = () => {
    if (review) { // review 객체가 존재하면 이미 리뷰가 작성된 것으로 판단
      setAlertVisible(true)

      return;
    }
    navigation.navigate('ReviewCreateScreen', { isbn13 });
  };

  const fetchReview = async () => {
    try {
      console.log('📡 특정 책 리뷰 API 호출 중, ISBN:', isbn13);
      const axiosResponse = await getMyReviewByIsbn(isbn13); // axios 응답 객체 전체를 받음
      const reviewData = axiosResponse.data; // 실제 리뷰 데이터는 response.data 안에 있습니다.

      console.log('📘 특정 책 리뷰 API 응답 원본 (axiosResponse):', axiosResponse);
      console.log('📘 특정 책 리뷰 API 응답 데이터 (reviewData):', reviewData);
      console.log('📘 특정 책 리뷰 API 응답 ID 필드:', reviewData ? reviewData.id : '데이터 없음 또는 id 필드 없음');

      if (reviewData) { // reviewData가 null이 아니면 유효한 리뷰 데이터
        console.log('✅ 유효한 리뷰 데이터 확인:', reviewData);
        setReview(reviewData); // 실제 리뷰 데이터를 상태에 저장
      } else {
        console.log('❌ 리뷰 데이터 없음 또는 유효하지 않음.');
        setReview(null); // 리뷰가 없으면 review 상태를 null로 설정
      }
    } catch (err) {
      console.error('❌ 특정 책 리뷰 불러오기 실패:', err);
      setReview(null);
      if (err.response && err.response.status !== 404) {
        setAlertVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // 새 ISBN으로 들어올 때마다 로딩 상태를 true로 설정
      fetchReview();
      return () => {
      };
    }, [isbn13])
  );

  const handleLikePress = async (id) => {
    try {
      await toggleLikeReview(id);
      fetchReview(); // 좋아요 상태 변경 후 리뷰 데이터 갱신
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
      setAlertVisible(true);
    }
  };

  const handleEditPress = (item) => {
    navigation.navigate('ReviewEditScreen', {
      review: item,
      isbn13: isbn13,
    });
  };

  const handleDeletePress = (id) => {
    setSelectedReviewId(id);
    setDeletePopupVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(selectedReviewId);
      setReview(null); // 리뷰 삭제 성공 시 review를 null로 설정하여 UI 갱신
      setDeletePopupVisible(false);
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      setAlertVisible(true);
    }
  };

  if (loading) {
    return (
      <CommonLayout>
        <Header title="내 리뷰" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title="내 리뷰" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* review 객체가 존재할 때만 MyBookReviewItem 렌더링 */}
        {review && review.id ? (
          <View style={styles.itemWrapper}>
            <MyBookReviewItem
              item={review}
              onLikePress={() => handleLikePress(review.id)}
              onEditPress={() => handleEditPress(review)}
              onDeletePress={() => handleDeletePress(review.id)}
            />
          </View>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>아직 이 책에 대한 리뷰가 없어요.</Text>
            <Text style={styles.emptyText}>리뷰를 작성해주세요.</Text>
          </View>
        )}

        <AlertPopup
          visible={alertVisible}
          title="이미 리뷰를 작성했어요"
          message="리뷰는 한 권당 한 번만 작성할 수 있어요."
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>


      <FixedBottomButton label="리뷰 작성" onPress={handleWritePress} />


      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="리뷰를 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />

    </CommonLayout>
  );
};

export default MyReviewsScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop:fixwidth*0.0177,
    paddingBottom: fixwidth * 0.15,
    paddingHorizontal: fixwidth * 0.037,
    justifyContent: 'flex-start',
  },
  itemWrapper: {
    marginBottom: fixwidth * 0.03,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom:fixwidth*0.17
  },
  emptyText: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    color: '#555',
    textAlign: 'center',
    lineHeight: fixwidth * 0.06,
  },
});
