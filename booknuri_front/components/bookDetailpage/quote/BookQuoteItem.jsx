import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import PureQuoteContent from './PureQuoteContent';
import VerticalGap from '../../public/publicUtil/VerticalGap';
import DownloadableQuoteCard from './DownloadableQuoteCard';

const { width: fixwidth } = Dimensions.get('window');

const BookQuoteItem = ({
                         item,
                         onLikePress,
                         onEditPress,
                         onDeletePress,
                         onReportPress,
                       }) => {
  const {
    quoteText,
    fontColor,
    fontScale,
    backgroundId,
    reviewerUsername,
    createdAt,
    likeCount,
    likedByCurrentUser,
    writtenByCurrentUser,
    id,
  } = item;

  const maskUsername = (name) => {
    if (!name) return '';
    return name.length <= 3 ? name + '****' : name.slice(0, 3) + '****';
  };

  return (
    <View style={styles.container}>
      {/* 💬 순수 인용 카드 */}
      <PureQuoteContent
        quoteText={quoteText}
        backgroundId={backgroundId}
        fontColor={fontColor}
        fontScale={fontScale}
      />

      <VerticalGap height={fixwidth*0.017}/>

      <DownloadableQuoteCard quoteId={id} />

      {/* 👇 하단 유저/날짜/버튼 영역 */}
      <View style={styles.footer}>
        <View style={styles.leftBox}>
          <Text style={styles.username}>{maskUsername(reviewerUsername)}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.date}>{createdAt?.slice(0, 10).replace(/-/g, '.')}</Text>

          {writtenByCurrentUser ? (
            <>
              <Text style={styles.separator}>|</Text>
              <TouchableOpacity onPress={() => onEditPress(item)}>
                <Text style={styles.actionText}>수정</Text>
              </TouchableOpacity>
              <Text style={styles.separator}>|</Text>
              <TouchableOpacity onPress={() => onDeletePress(id)}>
                <Text style={styles.actionText}>삭제</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.separator}>|</Text>
              <TouchableOpacity onPress={() => onReportPress(id)}>
                <Text style={styles.actionText}>신고</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={() => onLikePress(id)} style={styles.likeBox}>
          <FontAwesomeIcon
            icon={faHeart}
            size={fixwidth * 0.038}
            color={likedByCurrentUser ? '#FF6363' : '#ccc'}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookQuoteItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  footer: {
    marginTop: fixwidth * 0.001,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Bold',
    color: '#222',
  },
  separator: {
    marginHorizontal: fixwidth * 0.012,
    color: '#bbb',
    fontSize: fixwidth * 0.03,
  },
  date: {
    fontSize: fixwidth * 0.03,
    color: '#666',
  },
  actionText: {
    fontSize: fixwidth * 0.03,
    color: '#444',
    fontFamily: 'NotoSansKR-Regular',
  },
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.01,
    paddingHorizontal: fixwidth * 0.025,
    paddingVertical: fixwidth * 0.015,
    borderRadius: fixwidth * 0.012,
    backgroundColor: '#f2f2f2',
  },
  likeCount: {
    fontSize: fixwidth * 0.03,
    color: '#333',
  },
});
