import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import FixedBottomButton from '../../public/publicButton/FixedBottomButton';
import JoinCheckBox from '../../public/publicButton/JoinCheckBox'; // 체크박스
import VerticalGap from '../../public/publicUtil/VerticalGap';

const { height, width: fixwidth } = Dimensions.get('window');

const Step01 = ({ onNext }) => {
  const features = [
    '내 도서관에서 도서 검색하기',
    '내 이용기록 바탕으로 맞춤 도서 추천받기',
    '책 속 문장을 사진 찍어 인용문구로 저장하기',
    '책 독후감 작성하기',
    '읽고 싶은 도서 내 책장에 저장하기',
    '독서 캘린더 쓰기',
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ 세로 중앙 정렬 영역 */}
        <View style={styles.middleBlock}>
          {/* 인사말 */}
          <View style={styles.centerContent}>
            <Text style={styles.guideText}>책나루에 오신 걸 환영해요!</Text>
            <Text style={styles.guideSubText}>
              책나루는 공공도서관과 연결해 독서 생활을 편리하게 관리해주는 앱이에요.{'\n'}
              책나루에서는 아래와 같은 서비스를 이용하실 수 있어요.
            </Text>
          </View>

          <VerticalGap height={fixwidth * 0.07} />

          {/* 기능 소개 체크박스 */}
          <View style={styles.featureBox}>
            {features.map((item, idx) => (
              <View style={styles.checkItem} key={idx}>
                <JoinCheckBox label={item} value={true} onChange={() => {}} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <FixedBottomButton label="시작하기" onPress={onNext} />
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
    fontSize: fixwidth * 0.057,
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
    fontFamily: 'NotoSansKR-Regular',
    marginTop: fixwidth * 0.04,
  },
  featureBox: {
    gap: fixwidth * 0.057,
    marginTop: fixwidth * 0.017,
    backgroundColor: 'rgba(241,241,241,0.81)',
    padding: fixwidth * 0.037,
    borderRadius: fixwidth * 0.037,
  },
  checkItem: {
    paddingLeft: fixwidth * 0.01,
  },
});
