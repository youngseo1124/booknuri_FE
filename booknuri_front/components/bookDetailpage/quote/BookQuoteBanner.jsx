import React from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';
import BookQuoteItem from './BookQuoteItem';

const BookQuoteBanner = ({
                           quotes = [],
                           containerWidth = 0,
                           onLikePress,
                           onEditPress,
                           onDeletePress,
                           onReportPress,
                         }) => {
  const itemWidth = containerWidth * 0.9;
  const gap = containerWidth * 0.04;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <FlatList
        data={quotes}
        horizontal
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={itemWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: gap / 2 }}
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
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
      />
    </View>
  );
};

const { width: fixwidth } = Dimensions.get('window');
export default BookQuoteBanner;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: fixwidth*0.022,
  },
});
