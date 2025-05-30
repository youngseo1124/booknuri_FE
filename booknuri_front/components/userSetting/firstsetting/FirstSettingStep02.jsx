import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GenderSelectBox from '../GenderSelectBox';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import { setUserGender } from '../../../apis/apiFunction';

const { height,width: fixwidth } = Dimensions.get('window');

const Step02 = ({ onNext }) => {
  const [gender, setGender] = useState(null);
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!gender) {
      Alert.alert('성별을 선택해 주세요!');
      return;
    }

    try {
      const res = await setUserGender(gender);
      if (res.status === 200) {
        onNext();
      } else {
        Alert.alert('오류', '성별 저장에 실패했어요');
      }
    } catch (err) {
      console.error('❌ 성별 저장 실패:', err);
      Alert.alert('에러', '네트워크 오류가 발생했어요');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>성별을 선택해 주세요</Text>

        <View style={styles.boxWrapper}>
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
      </ScrollView>

      <FixedBottomButton label="다음" onPress={handleSubmit} disabled={!gender} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.06,
    paddingBottom: fixwidth * 0.15,
    maxHeight:height*1
  },
  title: {
    fontSize: fixwidth * 0.06,
    textAlign: 'center',
    fontFamily: 'NanumGothic-Bold',
    color: '#000000',
    marginBottom: fixwidth * 0.08,
    width: '100%',
  },
  boxWrapper: {
    width: '100%',
  },
});

export default Step02;
