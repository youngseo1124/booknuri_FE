import React from 'react';
import { StyleSheet, Text, ImageBackground, Dimensions, View } from 'react-native';

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

const PureQuoteContent = ({
                            quoteText,
                            backgroundId,
                            fontColor,
                            fontScale,
                            showTitle = false,
                            bookTitle = '',
                            capture = false, // 새 props 추가 (기본 false)
                          }) => {
  const fontSize = fixwidth * 0.024 + fontScale * 0.6;
  const radius = capture ? 0 : (showTitle ? 0 : fixwidth * 0.03);

  return (
    <ImageBackground
      source={backgroundImages[backgroundId] || backgroundImages[1]}
      style={[styles.card, { borderRadius: radius }]}
      imageStyle={[styles.bgImage, { borderRadius: radius }]}
    >
      {/* 본문 텍스트 - 플로우 레이아웃 */}
      <View style={styles.textWrapper}>
        <Text style={[styles.text, { color: fontColor, fontSize }]}>
          {quoteText ? quoteText.replace(/\n/g, '\n') : ''}
        </Text>
      </View>

      {/* 제목 텍스트 - 절대 위치 */}
      {showTitle && (
        <View style={styles.titleWrapper}>
          <Text style={[styles.bookTitle, { color: fontColor, fontSize: fontSize * 0.9 }]}>
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
    lineHeight: fixwidth * 0.05,
  },
  titleWrapper: {
    position: 'absolute',
    bottom: fixwidth * 0.047,
    width: '100%',
    alignItems: 'center',
  },
  bookTitle: {
    fontFamily: 'NotoSansKR-Medium',
  },
});
