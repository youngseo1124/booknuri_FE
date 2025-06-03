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

const { height, width: fixwidth } = Dimensions.get('window');

const Step02 = ({ onNext }) => {
  const [gender, setGender] = useState(null);
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!gender) {

      return;
    }

    try {
      const res = await setUserGender(gender);
      if (res.status === 200) {
        onNext();
      } else {

      }
    } catch (err) {
      console.error('❌ 성별 저장 실패:', err);

    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.middleBlock}>
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
        </View>
      </ScrollView>

      <FixedBottomButton label="다음" onPress={handleSubmit} disabled={!gender} />
    </View>
  );
};

export default Step02;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: fixwidth * 0.06,
  },
  middleBlock: {
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fixwidth * 0.058,
    textAlign: 'center',
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.07,
    color: '#000000',
    marginBottom: fixwidth * 0.08,
    width: '100%',
  },
  boxWrapper: {
    width: '100%',
  },
});
