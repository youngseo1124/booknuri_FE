import React from 'react';
import { StyleSheet, Text, ImageBackground, Dimensions, View } from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const hexToRgba = (hex, alpha = 1) => {
  if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

const PureQuoteContent = ({
                            quoteText,
                            backgroundId,
                            fontColor,
                            fontScale,
                            showTitle = false,
                            bookTitle = '',
                            capture = false,
                            height = fixwidth * 0.55, // ✅ 기본값 설정
                          }) => {
  const fontSize = fixwidth * 0.02 + fontScale * 0.6;
  const lineHeight = fontSize * 1.37;
  const radius = capture ? 0 : (showTitle ? 0 : fixwidth * 0.03);
  const transparentFontColor = hexToRgba(fontColor, 0.9);

  return (
    <ImageBackground
      source={backgroundImages[backgroundId] || backgroundImages[1]}
      style={[styles.card, { height, borderRadius: radius }]}
      imageStyle={[styles.bgImage, { borderRadius: radius }]}
    >
      <View style={styles.textWrapper}>
        <Text style={[styles.text, { color: fontColor, fontSize, lineHeight }]}>
          {quoteText ? quoteText.replace(/\n/g, '\n') : ''}
        </Text>
      </View>

      {showTitle && (
        <View style={styles.titleWrapper}>
          <Text style={[styles.bookTitle, { color: transparentFontColor, fontSize: fontSize * 0.9 }]}>
            - {bookTitle} -
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};


export default PureQuoteContent;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: fixwidth * 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  bgImage: {
    resizeMode: 'cover',
  },
  textWrapper: {
    paddingHorizontal: fixwidth * 0.05,
    alignItems: 'center',
    paddingBottom: fixwidth * 0.01,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'NotoSansKR-Regular',
  },
  titleWrapper: {
    position: 'absolute',
    bottom: fixwidth * 0.037,
    width: '100%',
    alignItems: 'center',
  },
  bookTitle: {
    fontFamily: 'NotoSansKR-Light',
  },
});
