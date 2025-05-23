import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import FixedBottomButton from '../../public/FixedBottomButton'; // ✅ 추가된 버튼 컴포넌트
import StepOneImage from '../../../image/firstSetting/stepOne.png';

const { width: fixwidth, height } = Dimensions.get('window');

const Step01 = ({ onNext }) => {
  return (
    <View style={styles.contentWrapper}>
      <View style={styles.centerContent}>
        <Text style={styles.guideText}>책누리에 오신 걸{'\n'}환영해요! 🙌</Text>
        <Text style={styles.guideSubText}>
          책누리는 공공도서관과 연결해{'\n'}
          독서 생활을 편리하게 관리해주는 앱이에요.{'\n'}
          더 나은 이용을 위해{'\n'}
          간단한 설정만 먼저 도와주세요 :)
        </Text>
      </View>

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

export default Step01;
