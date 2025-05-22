import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { setMyLibrary } from '../../apis/apiFunction';

import StepProgressHeader from '../../components/public/StepProgressHeader';
import FixedBottomButton from '../../components/public/FixedBottomButton';

// 📌 이미지 임포트
import StepOneImage from '../../image/firstSetting/stepOne.png';

const { width: fixwidth } = Dimensions.get('window');

const FirstSettingScreen01 = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  return (
      <View style={styles.container}>
        <StepProgressHeader totalSteps={4} currentStep={1} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Text style={styles.guideText}>
              {`책누리에 오신 걸\n환영해요! 🙌`}
            </Text>
            <Text style={styles.guideSubText}>
              {`책누리는 공공도서관과 연결해\n독서 생활을 편리하게 관리해주는 앱이에요.\n더 나은 이용을 위해\n간단한 설정만 먼저 도와주세요 :)`}
            </Text>
          </View>
        </ScrollView>

        {/* ✅ 하단 고정 이미지 */}
        <View style={styles.fixedImageWrapper}>
          <Image source={StepOneImage} style={styles.image} resizeMode="contain" />
        </View>

        {/* ✅ 하단 고정 버튼 */}
        <FixedBottomButton label="다음" onPress={() => navigation.navigate('FirstSettingStep02Screen')} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContent: {
    paddingHorizontal: fixwidth * 0.06,
    paddingBottom: fixwidth * 1
  },

  contentWrapper: {
    alignItems: 'center',
    width: '100%',
  },

  guideText: {
    fontSize: fixwidth * 0.067,
    color: '#444',
    paddingTop: fixwidth * 0.05,
    borderRadius: fixwidth * 0.02,
    textAlign: 'center',
    lineHeight: fixwidth * 0.08,
    fontFamily: 'NanumGothic-Bold',

  },

  guideSubText: {
    paddingTop: fixwidth * 0.05,
    fontSize: fixwidth * 0.04,
    color: '#444',
    borderRadius: fixwidth * 0.02,
    textAlign: 'center',
    lineHeight: fixwidth * 0.057,
    fontFamily: 'NanumGothic-Regular',
  },

  fixedImageWrapper: {
    position: 'absolute',
    bottom: fixwidth * 0,
    width: '100%',
    alignItems: 'center',
  },

  image: {
    width: fixwidth * 1,
    height: fixwidth * 0.95,
    resizeMode: 'contain',
  },
});

export default FirstSettingScreen01;
