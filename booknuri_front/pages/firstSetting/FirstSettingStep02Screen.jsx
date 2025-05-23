import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StepProgressHeader from '../../components/public/StepProgressHeader';
import FixedBottomButton from '../../components/public/FixedBottomButton';
import { setUserGender } from '../../apis/apiFunction';
import GenderSelectBox from '../../components/userSetting/GenderSelectBox';

const { width: fixwidth } = Dimensions.get('window');

const FirstSettingScreen02 = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState(null); // 'M' or 'F'

  const handleSubmit = async () => {
    if (!gender) return;

    try {
      const res = await setUserGender(gender);
      if (res.status === 200) {
        navigation.navigate('FirstSettingStep03Screen');
      }
    } catch (error) {
      Alert.alert('에러', '성별 설정 중 문제가 발생했어요 😢');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StepProgressHeader totalSteps={4} currentStep={2} />

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>성별을 선택해 주세요</Text>

        <GenderSelectBox
          label="여성"
          selected={gender === 'F'}
          onPress={() => setGender('F')}
        />
        <GenderSelectBox
          label="남성"
          selected={gender === 'M'}
          onPress={() => setGender('M')}
        />
      </View>

      <FixedBottomButton label="다음" disabled={!gender} onPress={handleSubmit} />
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
    paddingBottom: fixwidth * 0.15,
  },
  title: {
    fontSize: fixwidth * 0.06,
    textAlign: 'center',
    fontFamily: 'NanumGothic-Bold',
    color: '#000000',
    marginBottom: fixwidth * 0.08,
  },
});

export default FirstSettingScreen02;
