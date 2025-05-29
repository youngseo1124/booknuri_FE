import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fullStar } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const BookDetailRatingSummaryBlock = ({ averageRating = 0, ratingDistribution = {} }) => {
  const renderStars = (rating) => {
    const fullStars = Math.round(rating / 2);
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < fullStars ? fullStar : emptyStar}
        size={fixwidth * 0.045}
        color="#FFBC00"
        style={{ marginHorizontal: fixwidth * 0.007 }}
      />
    ));
  };

  const getStarCount = (score) => {
    return ratingDistribution[score] || 0;
  };

  const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  const renderDistribution = () => {
    return [10, 8, 6, 4, 2].map((score) => {
      const starCount = score / 2; // 5, 4, 3, 2, 1
      const count = getStarCount(score);
      const percent = total ? (count / total) * 100 : 0;

      return (
        <View key={score} style={styles.distRow}>
          {/*  왼쪽 별 아이콘 개수만큼 보여줌 */}
          <View style={styles.distStars}>
            {[...Array(starCount)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={fullStar}
                size={fixwidth * 0.027}
                color="#FFBC00"
                style={{ marginRight: fixwidth * 0.002 }}
              />
            ))}
          </View>

          {/* 막대 그래프 */}
          <View style={styles.barWrapper}>
            <View style={[styles.barFill, { width: `${percent}%` }]} />
          </View>

          {/* 개수 */}
          <Text style={styles.distCount}>{count}</Text>
        </View>
      );
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.boxWrapper}>
        {/* 왼쪽 - 평균 평점 */}
        <View style={styles.block}>
          <Text style={styles.label}>평균 별점</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.score}>{averageRating.toFixed(1)}</Text>
            <View style={styles.stars}>{renderStars(averageRating)}</View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 오른쪽 - 별점 분포 */}
        <View style={styles.block}>
          <Text style={styles.label}>별점 분포</Text>
          <View style={styles.distBox}>{renderDistribution()}</View>
        </View>
      </View>
    </View>
  );
};

export default BookDetailRatingSummaryBlock;

const styles = StyleSheet.create({
  container: {
    width: '97%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.0,
  },
  boxWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fffaf1',
    borderRadius: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.04,
    justifyContent: 'space-around',
  },
  block: {
    alignItems: 'center',
    width: '45%',
  },
  scoreBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: fixwidth * 0.05,
  },
  label: {
    fontSize: fixwidth * 0.04,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight:fixwidth * 0.05,
    marginBottom: fixwidth * 0.03,
  },
  score: {
    fontSize: fixwidth * 0.04,
    fontFamily: 'NotoSansKR-Light',
    lineHeight:fixwidth * 0.05,
    color: '#333',
    marginBottom: fixwidth * 0.01,
  },
  stars: {
    flexDirection: 'row',
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: fixwidth * 0.03,
    height: '100%',
    alignSelf: 'center',
  },
  distBox: {
    width: '100%',
    gap: fixwidth * 0.002,

  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  distLabel: {
    fontSize: fixwidth * 0.031,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight:fixwidth * 0.05,
    width: fixwidth * 0.07,
    color: '#333',
  },
  barWrapper: {
    flex: 1,
    height: fixwidth * 0.017,
    backgroundColor: '#eee',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FFBC00',
  },
  distCount: {
    width: fixwidth * 0.05,
    fontSize: fixwidth * 0.025,
    textAlign: 'right',
    color: '#444',
  },
  distStars: {
    width: fixwidth * 0.177,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

});
