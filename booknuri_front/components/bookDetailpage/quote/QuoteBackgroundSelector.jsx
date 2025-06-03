import React from 'react';
import { View, ImageBackground, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const backgroundImages = {
  1: require('../../../image/quote/one.jpg'),
  2: require('../../../image/quote/two.jpg'),
  3: require('../../../image/quote/three.jpg'),
  4: require('../../../image/quote/four.jpg'),
  5: require('../../../image/quote/five.jpg'),
  6: require('../../../image/quote/six.jpg'),
  7: require('../../../image/quote/seven.jpg'),
  8: require('../../../image/quote/eight.jpg'),
  9: require('../../../image/quote/nine.jpg'),
  10: require('../../../image/quote/ten.jpg'),
  11: require('../../../image/quote/eleven.jpg'),
  12: require('../../../image/quote/twelve.jpg'),
  13: require('../../../image/quote/thirteen.jpg'),
  14: require('../../../image/quote/fourteen.jpg'),
  15: require('../../../image/quote/fifteen.jpg'),
  16: require('../../../image/quote/sixteen.jpg'),
  17: require('../../../image/quote/seventeen.jpg'),
  18: require('../../../image/quote/eighteen.jpg'),
  19: require('../../../image/quote/nineteen.jpg'),
  20: require('../../../image/quote/twenty.jpg'),
  21: require('../../../image/quote/twentyone.jpg'),
  22: require('../../../image/quote/twentytwo.jpg'),
};


const QuoteBackgroundSelector = ({ selectedId, onSelect }) => {
  return (
    <FlatList
      data={Object.entries(backgroundImages)}
      horizontal
      keyExtractor={([id]) => id}
      contentContainerStyle={styles.scrollContainer}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: [id, image] }) => {
        const isSelected = Number(id) === selectedId;
        return (
          <TouchableOpacity onPress={() => onSelect(Number(id))}>
            <ImageBackground
              source={image}
              style={[styles.previewBox, isSelected && styles.selected]}
              imageStyle={styles.image}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default QuoteBackgroundSelector;

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 10,
    gap: 8,
    paddingHorizontal: 8,
  },
  previewBox: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#ff5500',
  },
  image: {
    resizeMode: 'cover',
  },
});
