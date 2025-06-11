import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { useNavigation } from '@react-navigation/native';
import VerticalGap from '../public/publicUtil/VerticalGap';

const { width: fixwidth } = Dimensions.get('window');

const MyBookReflectionItem = ({ item, onLikePress, onEditPress, onDeletePress }) => {
  const navigation = useNavigation();
  const hasImage = item.imageList?.length > 0;

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

  const handlePress = () => {
    navigation.navigate('DetailReflectionScreen', {
      reflectionId: item.id,
      isbn13: item.isbn13,
    });
    console.log('✅ MyBookReflectionItem item:', item);

  };

  return (
    <View style={styles.card}>

      <View style={styles.stars}>{renderStars(item.rating)}</View>

      {/* 요약 형태 본문 */}
      <TouchableOpacity
        style={styles.previewRow}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Text style={styles.contentText} numberOfLines={5}>
          <Text style={styles.titleText}>{item.title + '\n'}</Text>
          {item.content}
        </Text>

        {hasImage && (
          <Image
            source={{ uri: item.imageList[0].url }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      {/* 날짜 */}
      <Text style={styles.date}>
        {item.createdAt?.slice(0, 10).replace(/-/g, '.')}
      </Text>

      {/* 버튼 영역 */}
      <View style={styles.footerRow}>
        <View style={styles.leftBox}>
          <TouchableOpacity onPress={() => onEditPress(item)}>
            <Text style={styles.footerText}>수정</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>|</Text>
          <TouchableOpacity onPress={() => onDeletePress(item.id)}>
            <Text style={styles.footerText}>삭제</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onLikePress(item.id)} style={styles.likeBox}>
          <FontAwesomeIcon
            icon={faHeart}
            size={fixwidth * 0.04}
            color={item.likedByCurrentUser ? '#FF6363' : '#d0d0d0'}
          />
          <Text style={styles.footerText}>{item.likeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyBookReflectionItem;

const styles = StyleSheet.create({
  card: {
    width: '100%',
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
  previewRow: {
    flexDirection: 'row',
    gap: fixwidth * 0.025,
    backgroundColor: '#f5f5f5',
    borderRadius: fixwidth * 0.02,
    padding: fixwidth * 0.03,
    marginHorizontal: -fixwidth * 0.007,
  },
  contentText: {
    flex: 1,
    fontSize: fixwidth * 0.037,
    lineHeight: fixwidth * 0.052,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
  },
  thumbnail: {
    width: fixwidth * 0.18,
    height: fixwidth * 0.27,
    borderRadius: fixwidth * 0.01,
    backgroundColor: '#eee',
  },
  titleText: {
    fontSize: fixwidth * 0.04,
    color: '#222',
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.06,
  },
  date: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Light',
    color: '#888',
    marginTop: fixwidth * 0.01,
    lineHeight: fixwidth * 0.05,
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
  separator: {
    marginHorizontal: fixwidth * 0.015,
    color: '#ccc',
  },
  footerText: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.0577,
    color: '#666',
  },
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.015,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: fixwidth * 0.017,
    borderRadius: fixwidth * 0.01,
    borderWidth: fixwidth * 0.001,
    borderColor: '#eee',
  },
});
