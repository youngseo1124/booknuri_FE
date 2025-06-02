import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import BookQuoteItem from '../public/bookpublic/BookQuoteItem';

const { width: fixwidth } = Dimensions.get('window');
const itemWidth = fixwidth * 0.82;

const BookQuoteBanner = ({
                           quotes = [],
                           onLikePress,
                           onEditPress,
                           onDeletePress,
                           onReportPress,
                         }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={quotes}
        horizontal
        pagingEnabled={true} // ✅ 이거 꼭!
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollArea}
        snapToInterval={itemWidth + fixwidth * 0.04} // ✅ 정확한 snap
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: itemWidth }}>
            <BookQuoteItem
              item={item}
              onLikePress={onLikePress}
              onEditPress={onEditPress}
              onDeletePress={onDeletePress}
              onReportPress={onReportPress}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ width: fixwidth * 0.04 }} />}
      />
    </View>
  );
};

export default BookQuoteBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: fixwidth * 0.03,
  },
  scrollArea: {
    paddingHorizontal: fixwidth * 0.03,
  },
});
