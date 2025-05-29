import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faHeart, faStar as solidStar, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const BookReviewItem = ({ item, onLikePress, onReportPress }) => {
  const renderStars = (rating) => {
    const fullStars = Math.round(rating / 2);
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < fullStars ? solidStar : emptyStar}
        size={fixwidth * 0.04}
        color="#FFBC00"
        style={{ marginHorizontal: fixwidth * 0.005 }}
      />
    ));
  };

  const maskUsername = (name) => {
    if (!name) return '';
    return name.length <= 3 ? name + '****' : name.slice(0, 3) + '****';
  };

  return (
    <View style={styles.reviewCard}>
      {/* 별점 */}
      <View style={styles.stars}>{renderStars(item.rating)}</View>

      {/* 내용 */}
      <Text style={styles.content}>{item.content}</Text>

      {/* 닉네임 */}
      <Text style={styles.username}>{maskUsername(item.reviewerUsername)}</Text>

      {/* 날짜 | 신고   👍따봉 */}
      <View style={styles.footerRow}>
        <View style={styles.leftBox}>
          <Text style={styles.date}>
            {item.createdAt?.slice(0, 10).replace(/-/g, '.')}
          </Text>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => onReportPress(item.id)}>
            <Text style={styles.reportText}>신고</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onLikePress(item.id)} style={styles.likeBox}>
          <FontAwesomeIcon
            icon={faHeart} // ✅ 하트로 교체!
            size={fixwidth * 0.04}
            color={item.likedByCurrentUser ? '#FF6363' : '#d0d0d0'} // 빨간 하트
          />
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookReviewItem;

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.035,
    paddingHorizontal: fixwidth * 0.042,
    borderWidth: 1,
    borderColor: '#dddcdc',
  },
  stars: {
    flexDirection: 'row',
    marginBottom: fixwidth * 0.02,
  },
  content: {
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.06,
    color: '#333',
    paddingVertical: fixwidth * 0.011,
  },
  username: {
    fontSize: fixwidth * 0.029,
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.05,
    color: '#000',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Light',
    lineHeight: fixwidth * 0.06,
    color: '#888',
  },
  separator: {
    marginHorizontal: fixwidth * 0.015,
    color: '#ccc',
    fontSize: fixwidth * 0.032,
  },
  reportText: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.06,
    color: '#666',
  },
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.015,
    borderWidth: fixwidth * 0.002,
    borderColor:  '#f3f3f3',
    paddingHorizontal: fixwidth * 0.0177,
    paddingVertical: fixwidth * 0.007,
    borderRadius: fixwidth * 0.011,
    backgroundColor: '#f5f5f5',
  },
  actionText: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.06,
    color: '#666',
  },
});
