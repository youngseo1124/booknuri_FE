import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import StepOneImage from '../../../image/firstSetting/stepOne.png';

const { height,width: fixwidth } = Dimensions.get('window');

const Step01 = ({ onNext }) => {

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: fixwidth * 0.07,
          paddingTop: fixwidth * 0.18,
          maxHeight:height*1,

        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🟢 콘텐츠 영역 */}
        <View style={styles.flexContainer}>
          <View style={styles.centerContent}>
            <Text style={styles.guideText}>책누리에 오신 걸{'\n'}환영해요! 🙌</Text>
            <Text style={styles.guideSubText}>
              책누리는 공공도서관과 연결해{'\n'}
              독서 생활을 편리하게 관리해주는 앱이에요.{'\n'}
              더 나은 이용을 위해{'\n'}
              간단한 설정만 먼저 도와주세요 :)
            </Text>
          </View>

          {/*  이미지: 맨 아래로 */}
          <View style={styles.imageWrapper}>
            <Image source={StepOneImage} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>

      {/*  하단 버튼 */}
      <FixedBottomButton label="시작하기" onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'space-between', // 텍스트 위, 이미지 아래로 떨어뜨림
  },
  centerContent: {
    paddingTop: fixwidth*0.37,
    alignItems: 'center',
    minHeight:fixwidth * 0.4,
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
  imageWrapper: {
    alignItems: 'center',
    marginTop: fixwidth * 0.1,
  },
  image: {
    width: fixwidth * 1,
    height: fixwidth * 0.9,
  },
});

export default Step01;
