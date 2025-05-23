import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StepProgressHeader from '../../components/public/StepProgressHeader';
import FixedBottomButton from '../../components/public/FixedBottomButton';
import StepOneImage from '../../image/firstSetting/stepOne.png';

const { height,width: fixwidth } = Dimensions.get('window');

const FirstSettingScreen01 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StepProgressHeader totalSteps={4} currentStep={1} />

      {/* 🔥 중앙 텍스트 + 하단 이미지 */}
      <View style={styles.contentWrapper}>
        <View style={styles.centerContent}>
          <Text style={styles.guideText}>
            책누리에 오신 걸{'\n'}환영해요! 🙌
          </Text>
          <Text style={styles.guideSubText}>
            책누리는 공공도서관과 연결해{'\n'}
            독서 생활을 편리하게 관리해주는 앱이에요.{'\n'}
            더 나은 이용을 위해{'\n'}
            간단한 설정만 먼저 도와주세요 :)
          </Text>
        </View>

        <Image source={StepOneImage} style={styles.image} resizeMode="contain" />
      </View>

      {/* ✅ 하단 고정 버튼 */}
      <FixedBottomButton
        label="다음"
        onPress={() => navigation.navigate('FirstSettingStep02Screen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.06,
    minHeight:height*1.1

  },

  centerContent: {
    alignItems: 'center',
    marginBottom: fixwidth * 0.08, // 텍스트와 이미지 사이
  },

  guideText: {
    fontSize: fixwidth * 0.067,
    textAlign: 'center',
    lineHeight: fixwidth * 0.08,
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
    width: fixwidth * 1,
    height: fixwidth * 0.9,
    resizeMode: 'contain'
  },
});

export default FirstSettingScreen01;
