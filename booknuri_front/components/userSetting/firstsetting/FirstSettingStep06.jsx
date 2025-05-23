import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import FixedBottomButton from '../../public/FixedBottomButton'; // ✅ 추가된 버튼 컴포넌트
import StepOneImage from '../../../image/firstSetting/stepOne.png';
import LottieView from 'lottie-react-native';

const { width: fixwidth, height } = Dimensions.get('window');

const Step06 = ({ onNext }) => {
  return (
    <View style={styles.contentWrapper}>
      <View style={styles.centerContent}>
        <Text style={styles.guideText}>모든 준비가 끝났어요!</Text>
        <Text style={styles.guideSubText}>
          이제 책누리가 여러분의 독서 여정을 도와드릴게요 {'\n'}😊
        </Text>
      </View>



      <LottieView
        source={require('../../../assets/lottie/cofetti.json')}
        autoPlay
        loop={false}
        style={[styles.lottie, { zIndex: 10, position: 'absolute', top: 0 }]}
      />



      <Image source={StepOneImage} style={styles.image} resizeMode="contain" />

      <FixedBottomButton label="시작하기" onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.07,
    backgroundColor: '#fff',
    paddingTop: fixwidth * 0.6,

  },
  centerContent: {
    alignItems: 'center',
    height:height*0.17
  },
  guideText: {
    fontSize: fixwidth * 0.067,
    textAlign: 'center',
    fontFamily: 'NanumGothic-Bold',
    color: '#000000',
  },
  guideSubText: {
    paddingTop: fixwidth * 0.05,
    fontSize: fixwidth * 0.04,
    color: '#444',
    textAlign: 'center',
    lineHeight: fixwidth * 0.057,
    fontFamily: 'NanumGothic-Regular',
  },
  image: {
    marginTop: height*0.02,
    width: fixwidth * 1,
    height: fixwidth *1,
    resizeMode: 'contain',
  },
});

export default Step06;
