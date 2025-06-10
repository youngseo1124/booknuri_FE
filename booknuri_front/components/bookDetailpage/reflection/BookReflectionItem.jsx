import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import {useNavigation} from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const BookReflectionItem = ({ item, onLikePress, onReportPress, onEditPress, onDeletePress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasImage = item.imageList?.length > 0;
  const navigation = useNavigation();

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
    <View style={styles.card}>
      {/* ⭐ 별점 */}
      <View style={styles.stars}>{renderStars(item.rating)}</View>

      {/*  접힌 상태: 텍스트 + 썸네일 나란히 */}
      {/*  접힌 상태: 텍스트 + 썸네일 나란히 */}
      {!isExpanded ? (
        <TouchableOpacity
          style={styles.previewRow}
          onPress={() => setIsExpanded(true)}
          activeOpacity={0.9}
        >
          {/*  스포일러 표시 분기 */}
          {item.containsSpoiler ? (
            <View style={styles.spoilerBox}>
              <Text style={styles.spoilerText}>
                ⚠️ 스포일러가 포함된 독후감입니다.{"\n"}클릭 시 확인 가능합니다.
              </Text>
            </View>
          ) : (
            <Text style={styles.contentText} numberOfLines={5}>
              <Text style={styles.titleText}>{item.title + '\n'}</Text>
              {item.content}
            </Text>
          )}


          {hasImage && (
            <Image
              source={{ uri: item.imageList[0].url }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      ) : (
        // 펼쳐진 상태
        <TouchableOpacity onPress={() => setIsExpanded(false)} activeOpacity={0.9}>


          <View
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: fixwidth * 0.02,
              paddingHorizontal: fixwidth * 0.03,
              marginHorizontal: -fixwidth * 0.007,
              paddingBottom: fixwidth * 0.025,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailReflectionScreen', {
                  reflectionId: item.id,
                  isbn13: item.isbn13,
                })
              }
              style={{ marginTop: fixwidth * 0.025 }}
            >
              <Text
                style={{
                  fontSize: fixwidth * 0.032,
                  color: 'rgba(0,0,0,0.57)',
                  fontFamily: 'NotoSansKR-Medium',
                  lineHeight: fixwidth * 0.047,
                  textAlign: 'left',
                  textDecorationLine: 'underline',
                  paddingTop: fixwidth * 0.017,
                  paddingVertical: fixwidth * 0.01,
                }}
              >
                상세페이지로 보기
              </Text>
            </TouchableOpacity>
            {item.imageList.map((imgObj, idx) => (
              <Image
                key={imgObj.id || idx}
                source={{ uri: imgObj.url }}
                style={styles.expandedImage}
                resizeMode="contain"
              />
            ))}
            <Text style={[styles.contentText, { marginTop: fixwidth * 0.03 }]}>
              <Text style={styles.titleText}>{item.title + '\n'}</Text>
              {item.content}
            </Text>
          </View>
        </TouchableOpacity>
      )}


      {/* 👤 작성자 */}
      <Text style={styles.username}>{maskUsername(item.reviewerUsername)}</Text>

      {/* 푸터 */}
      <View style={styles.footerRow}>
        <View style={styles.leftBox}>
          <Text style={styles.date}>
            {item.createdAt?.slice(0, 10).replace(/-/g, '.')}
          </Text>
          <Text style={styles.separator}>|</Text>

          {item.writtenByCurrentUser ? (
            <>
              <TouchableOpacity onPress={() => onEditPress(item)}>
                console.log("🛠️ onEditPress 호출됨", item);
                <Text style={styles.footerText}>수정</Text>
              </TouchableOpacity>

              <Text style={styles.separator}>|</Text>
              <TouchableOpacity onPress={() => onDeletePress(item.id)}>
                <Text style={styles.footerText}>삭제</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => onReportPress(item.id)}>
              <Text style={styles.footerText}>신고</Text>
            </TouchableOpacity>
          )}
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

export default BookReflectionItem;

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
    lineHeight: fixwidth * 0.058,
    fontFamily: 'NotoSansKR-Regular',
    color: '#333',
  },
  thumbnail: {
    width: fixwidth * 0.18,
    height: fixwidth * 0.27,
    borderRadius: fixwidth * 0.01,
    backgroundColor: '#eee',
  },
  expandedImage: {
    width: '100%',
    height: fixwidth * 0.5,
    borderRadius: fixwidth * 0.02,
    marginTop: fixwidth * 0.02,
  },
  username: {
    fontSize: fixwidth * 0.03,
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.05,
    color: '#000',
    marginTop: fixwidth * 0.02,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: fixwidth * 0.0,
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Light',
    lineHeight: fixwidth * 0.058,
    color: '#888',
  },
  separator: {
    marginHorizontal: fixwidth * 0.015,
    color: '#ccc',
  },
  footerText: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.058,
    color: '#666',
  },
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.015,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: fixwidth * 0.017,
    paddingVertical: fixwidth * 0.007,
    borderRadius: fixwidth * 0.01,
    borderWidth: fixwidth * 0.001,
    borderColor: '#eee',
  },

  titleText: {
    fontSize: fixwidth * 0.04,
    color: '#222',
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.07,
  },
  spoilerBox: {
    flex: 1,
    justifyContent: 'center',
  },

  spoilerText: {
    paddingVertical: fixwidth * 0.077,
    fontSize: fixwidth * 0.03,
    lineHeight: fixwidth * 0.05,
    fontFamily: 'NotoSansKR-Regular',
    color: '#000000',
    backgroundColor: '#FFF1F1',
    borderRadius: fixwidth * 0.01,
    textAlign: 'center',
  },

});
