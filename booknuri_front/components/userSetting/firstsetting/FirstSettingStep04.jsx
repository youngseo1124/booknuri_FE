import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';

const { height, width: fixwidth } = Dimensions.get('window');

const Step01 = ({ onNext }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ 세로 중앙 정렬 영역 */}
        <View style={styles.middleBlock}>
          <View style={styles.centerContent}>
            <Text style={styles.guideText}>내 도서관을 설정해 주세요</Text>
            <Text style={styles.guideSubText}>
              책나루는 설정한 내 도서관 기준으로 다양한 서비스를 제공해요.{'\n'}
              현재는 서버 비용 절감을 위해{'\n'}
              충남, 경북, 충북, 전남 울산 지역만 지원 중이니{'\n'}
              이 중에서 도서관을 선택해 주세요 :)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <FixedBottomButton label="다음" onPress={onNext} />
    </View>
  );
};

export default Step01;

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
  },
  centerContent: {
    alignItems: 'center',
  },
  guideText: {
    fontSize: fixwidth * 0.06,
    textAlign: 'center',
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight: fixwidth * 0.1,
    color: '#000000',

  },
  guideSubText: {
    fontSize: fixwidth * 0.038,
    color: '#000000',
    textAlign: 'center',
    lineHeight: fixwidth * 0.067,
    backgroundColor: 'rgba(241,241,241,0.81)',
    fontFamily: 'NanumGothic-Regular',
    marginTop: fixwidth * 0.04,

    padding: fixwidth * 0.047,
    borderRadius: fixwidth * 0.05,
  },
});
