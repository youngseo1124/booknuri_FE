import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StepProgressHeader from '../../components/public/StepProgressHeader';
import FixedBottomButton from '../../components/public/FixedBottomButton';
import { setUserBirth } from '../../apis/apiFunction';

const { width: fixwidth } = Dimensions.get('window');

const FirstSettingStep03Screen = () => {
  const navigation = useNavigation();
  const [birth, setBirth] = useState('');

  const handleSubmit = async () => {
    const birthNum = parseInt(birth, 10);

    if (!birthNum || birth.length !== 4 || birthNum < 1900 || birthNum > new Date().getFullYear()) {
      Alert.alert('유효한 출생년도를 입력해 주세요');
      return;
    }

    try {
      const res = await setUserBirth(birthNum);
      if (res.status === 200) {
        navigation.navigate('FirstSettingStep04Screen');
      }
    } catch (error) {
      Alert.alert('에러', '출생년도 설정 중 문제가 발생했어요');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StepProgressHeader totalSteps={4} currentStep={3} />

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>출생년도를 입력해 주세요</Text>
        <TextInput
          value={birth}
          onChangeText={setBirth}
          keyboardType="numeric"
          maxLength={4}
          placeholder="예: 1999"
          style={styles.input}
        />
      </View>

      <FixedBottomButton label="다음" disabled={!birth} onPress={handleSubmit} />
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
    marginBottom: fixwidth * 0.05,
  },
  input: {
    width: fixwidth * 0.6,
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
    fontSize: fixwidth * 0.05,
    textAlign: 'center',
    paddingVertical: fixwidth * 0.03,
    fontFamily: 'NanumGothic-Regular',
  },
});

export default FirstSettingStep03Screen;
