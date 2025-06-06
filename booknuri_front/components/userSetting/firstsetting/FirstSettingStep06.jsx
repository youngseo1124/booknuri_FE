import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import StepOneImage from '../../../image/firstSetting/stepOne.png';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import {userinfo} from '../../../apis/apiFunction';

const { height, width: fixwidth } = Dimensions.get('window');

const Step06 = () => {
  const navigation = useNavigation();
  const { setUserInfo } = useContext(LoginContext);

  const onNext = async () => {
    try {
      const res = await userinfo();
      if (res.status === 200) {
        setUserInfo(res.data);
        navigation.navigate('MainTab');
      } else {
        console.warn("유저 정보 가져오기 실패", res);
      }
    } catch (err) {
      console.error('❌ 유저 정보 갱신 실패:', err);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* ✅ 세로 중앙 정렬 콘텐츠 영역 */}
        <View style={styles.middleBlock}>
          {/* 애니메이션 */}
          <LottieView
            source={require('../../../assets/lottie/cofetti.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />

          {/* 인사말 */}
          <View style={styles.centerContent}>
            <Text style={styles.guideText}>모든 준비가 끝났어요!</Text>
            <Text style={styles.guideSubText}>
              이제 책나루가 여러분의 독서 여정을 도와드릴게요{'\n'}😊
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <FixedBottomButton label="시작하기" onPress={onNext} />
    </View>
  );
};

export default Step06;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: fixwidth * 0.07,
  },
  middleBlock: {
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: fixwidth * 1,
    height: height * 0.77,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: fixwidth * 0.08,
  },
  guideText: {
    fontSize: fixwidth * 0.059,
    textAlign: 'center',
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.1,
    color: '#000000',
  },
  guideSubText: {
    fontSize: fixwidth * 0.037,
    color: '#000000',
    textAlign: 'center',
    lineHeight: fixwidth * 0.067,
    backgroundColor: 'rgba(241,241,241,0.81)',
    padding: fixwidth * 0.037,
    borderRadius: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    marginTop: fixwidth * 0.04,
  },

});
