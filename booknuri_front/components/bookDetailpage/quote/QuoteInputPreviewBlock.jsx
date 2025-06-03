import React from 'react';
import { StyleSheet, TextInput, ImageBackground, Dimensions } from 'react-native';

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
  16: require('../../../image/quote/sixteen.jpg'),
  17: require('../../../image/quote/seventeen.jpg'),
  18: require('../../../image/quote/eighteen.jpg'),
  19: require('../../../image/quote/nineteen.jpg'),
  20: require('../../../image/quote/twenty.jpg'),
  21: require('../../../image/quote/twentyone.jpg'),
  22: require('../../../image/quote/twentytwo.jpg'),
};

const QuoteInputPreviewBlock = ({ quoteText, backgroundId, fontColor, fontScale, onChangeText }) => {
  const fontSize = fixwidth * 0.02 + fontScale * 0.6;
  const lineHeight = fontSize * 1.37;

  return (
    <ImageBackground
      source={backgroundImages[backgroundId] || backgroundImages[1]}
      style={styles.card}
      imageStyle={styles.bgImage}
    >
      <TextInput
        multiline
        placeholder="인용 문구를 입력하세요"
        placeholderTextColor={fontColor}
        value={quoteText}
        onChangeText={onChangeText}
        style={[
          styles.textInput,
          {
            color: fontColor,
            fontSize,
            lineHeight,
            height: fixwidth * 0.5,
            paddingVertical: 0,
          },
        ]}
        maxLength={200}
        textAlign="center"
        textAlignVertical="center"
      />
    </ImageBackground>
  );
};

export default QuoteInputPreviewBlock;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: fixwidth * 0.56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: fixwidth * 0.03,
    overflow: 'hidden',
  },
  bgImage: {
    resizeMode: 'cover',
    borderRadius: fixwidth * 0.03,
  },
  textInput: {
    width: '100%',
    fontFamily: 'NotoSansKR-Regular',
    textAlignVertical: 'center',
  },
});
