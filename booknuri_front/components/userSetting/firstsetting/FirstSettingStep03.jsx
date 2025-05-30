import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions, Alert } from 'react-native';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import { setUserBirth } from '../../../apis/apiFunction';

const { width: fixwidth } = Dimensions.get('window');

const Step03 = ({ onNext }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const isValidDate = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    return (
      year.length === 4 &&
      !isNaN(y) &&
      y >= 1900 &&
      y <= new Date().getFullYear() &&
      m >= 1 && m <= 12 &&
      d >= 1 && d <= 31
    );
  };

  const handleSubmit = async () => {
    if (!isValidDate()) {
      Alert.alert('⚠️ 유효한 생년월일을 입력해 주세요');
      return;
    }

    const formatted = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    try {
      const res = await setUserBirth(formatted);
      if (res.status === 200) {
        onNext();
      }
    } catch (e) {
      Alert.alert('에러', '생년월일 저장 실패');
      console.error(e);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>생년월일을 입력해 주세요</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="0000년"
          />
          <TextInput
            style={styles.input}
            value={month}
            onChangeText={setMonth}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00월"
          />
          <TextInput
            style={styles.input}
            value={day}
            onChangeText={setDay}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00일"
          />
        </View>
      </View>

      <FixedBottomButton
        label="다음"
        onPress={handleSubmit}
        disabled={!(year && month && day)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.06,
    paddingBottom: fixwidth * 0.35,
  },
  title: {
    fontSize: fixwidth * 0.06,
    fontFamily: 'NanumGothic-Bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: fixwidth * 0.07,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: fixwidth * 0.02,
  },
  input: {
    flex: 1,
    fontSize: fixwidth * 0.045,
    borderBottomWidth: 1.5,
    borderBottomColor: '#aaa',
    textAlign: 'center',
    paddingVertical: fixwidth * 0.03,
    fontFamily: 'NanumGothic-Regular',
  },
});

export default Step03;
