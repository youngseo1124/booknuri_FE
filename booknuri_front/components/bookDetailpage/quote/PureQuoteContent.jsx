import React from 'react';
import { StyleSheet, Text, ImageBackground, Dimensions } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

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
};

const PureQuoteContent = ({ quoteText, backgroundId, fontColor, fontScale ,showTitle = false,
                            bookTitle = '',}) => {
  const fontSize = fixwidth * 0.024 + fontScale * 0.6;

  return (
    <ImageBackground
      source={backgroundImages[backgroundId] || backgroundImages[1]}
      style={styles.card}
      imageStyle={styles.bgImage}
    >
      <Text style={[styles.text, { color: fontColor, fontSize }]}>
        {quoteText ? quoteText.replace(/\n/g, '\n') : ''}
      </Text>

      {showTitle && (
        <Text style={styles.bookTitle}>
          - {bookTitle} -
        </Text>
      )}
    </ImageBackground>
  );
};

export default PureQuoteContent;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: fixwidth * 0.56, // height는 가로 기준 70%
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: fixwidth * 0.03,
    overflow: 'hidden',
  },
  bgImage: {
    resizeMode: 'cover',
    borderRadius: fixwidth * 0.03,
  },
  text: {
    textAlign: 'center',
    fontFamily:'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.05,
    paddingBottom: fixwidth * 0.007
  },
  bookTitle: {
    fontSize: fixwidth * 0.032,
    marginTop: fixwidth * 0.015,
    fontFamily: 'NotoSansKR-Bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
