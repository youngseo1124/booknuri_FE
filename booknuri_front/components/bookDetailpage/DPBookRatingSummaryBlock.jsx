import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import SectionHeader from '../public/publicHeader/SectionHeader';

const { width: fixwidth } = Dimensions.get('window');

const DPBookRatingSummaryBlock = ({ reviewRating, reflectionRating }) => {
  const renderStars = (rating) => {
    const fullStars = Math.round(rating || 0);
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < fullStars ? solidStar : emptyStar}
        size={fixwidth * 0.045}
        color="#FFBC00"
        style={{ marginHorizontal: fixwidth * 0.007 }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <SectionHeader label="평점" />

      <View style={styles.innerBox}>
        {/* 리뷰 블럭 */}
        <View style={styles.block}>
          <Text style={styles.label}>리뷰</Text>
          {reviewRating ? (
            <View style={styles.placeholderWrapper}>
              <Text style={styles.score}>{reviewRating.toFixed(1)}</Text>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Text style={styles.placeholderText}>
                아직 리뷰가 없어요{"\n"}첫 리뷰를 작성해주세요
              </Text>
            </View>
          )}
          <View style={styles.stars}>
            {reviewRating ? renderStars(reviewRating / 2) : renderStars(0)}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 독후감 블럭 */}
        <View style={styles.block}>
          <Text style={styles.label}>독후감</Text>
          {reflectionRating ? (
            <View style={styles.placeholderWrapper}>
              <Text style={styles.score}>{reflectionRating.toFixed(1)}</Text>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Text style={styles.placeholderText}>
                아직 독후감이 없어요{"\n"}첫 독후감을 작성해주세요
              </Text>
            </View>
          )}
          <View style={styles.stars}>
            {reflectionRating ? renderStars(reflectionRating / 2) : renderStars(0)}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DPBookRatingSummaryBlock;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
  innerBox: {
    flexDirection: 'row',
    backgroundColor: '#fffaf1',
    borderRadius: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.04,
    justifyContent: 'space-around',
    marginVertical: fixwidth * 0.02,
  },
  block: {
    alignItems: 'center',
    width: '45%',
  },
  label: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.07,
  },
  score: {
    fontSize: fixwidth * 0.05,
    fontFamily: 'NotoSansKR-Light',
    color: '#333',
    lineHeight: fixwidth * 0.06,
  },
  placeholderText: {
    fontSize: fixwidth * 0.026,
    fontFamily: 'NotoSansKR-Light',
    color: '#676767',
    lineHeight: fixwidth * 0.037,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
  },
  placeholderWrapper: {
    height: fixwidth * 0.147,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: fixwidth * 0.01,
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: fixwidth * 0.03,
    height: '100%',
    alignSelf: 'center',
  },
});
