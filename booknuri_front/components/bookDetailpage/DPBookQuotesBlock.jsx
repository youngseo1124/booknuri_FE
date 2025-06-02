import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import SectionHeader from '../public/bookpublic/SectionHeader';
import SortTabs from '../public/bookpublic/SortTabs';
import MoreButton from '../public/publicButton/MoreButton';
import BookQuoteBanner from './BookQuoteBanner'; // ✅ 인용 배너 임포트

const { width: fixwidth } = Dimensions.get('window');

const DPBookQuotesBlock = ({
                             quotes,
                             totalCount,
                             currentSort,
                             onSortChange,
                             isbn13,
                             navigation,
                             onLikePress,
                             onEditPress,
                             onDeletePress,
                             onReportPress,
                           }) => {
  return (
    <View style={styles.container}>
      <SectionHeader label={`인용 (${totalCount})`} />

      {quotes?.length > 0 ? (
        <BookQuoteBanner
          quotes={quotes}
          onLikePress={onLikePress}
          onEditPress={onEditPress}
          onDeletePress={onDeletePress}
          onReportPress={onReportPress}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 인용이 없어요.</Text>
        </View>
      )}

      <MoreButton
        label="인용 전체 보기"
        onPress={() => navigation.navigate('BookQuoteListScreen', { isbn13 })}
      />
    </View>
  );
};

export default DPBookQuotesBlock;

const styles = StyleSheet.create({
  container: {
    width: '93%',
    alignSelf: 'center',
    paddingVertical: fixwidth * 0.07,
  },
  emptyContainer: {
    minHeight: fixwidth * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: fixwidth * 0.02,
  },
  emptyText: {
    fontSize: fixwidth * 0.033,
    color: '#888',
    fontFamily: 'NotoSansKR-Regular',
  },
});
