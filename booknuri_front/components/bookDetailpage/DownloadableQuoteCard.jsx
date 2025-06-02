import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

import { getMyQuoteById } from '../../apis/apiFunction_bookQuote';
import PureQuoteContent from './quote/PureQuoteContent';

const { width: fixwidth } = Dimensions.get('window');

const DownloadableQuoteCard = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const viewRef = useRef();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyQuoteById(quoteId);
        setQuote(res.data);
      } catch (err) {
        console.error('❌ 인용 불러오기 실패:', err);
      }
    };
    fetch();
  }, [quoteId]);

  // 권한 요청 (Android)
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const writeGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '저장소 권한 요청',
            message: '이미지 저장을 위해 저장소 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );

        let manageGranted = PermissionsAndroid.RESULTS.GRANTED;
        if (Platform.Version >= 30) {
          manageGranted = await PermissionsAndroid.request(
            'android.permission.MANAGE_EXTERNAL_STORAGE',
            {
              title: '고급 저장소 권한 요청',
              message: '더 넓은 저장소 접근 권한이 필요합니다.',
              buttonNeutral: '나중에',
              buttonNegative: '취소',
              buttonPositive: '허용',
            },
          );
        }

        return writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
          manageGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleDownload = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('권한 거부됨', '저장소 권한이 필요합니다!');
      return;
    }

    try {
      // 화면 밖에 숨겨진 뷰 캡쳐 (뷰 위치 화면 밖으로 숨김)
      const uri = await captureRef(viewRef, { format: 'png', quality: 1 });

      // 저장 경로 및 파일명 지정
      const fileName = `quote_${Date.now()}.png`;
      const destPath = `${RNFS.PicturesDirectoryPath}/booknuri`;
      const filePath = `${destPath}/${fileName}`;

      // 폴더 없으면 생성
      const folderExists = await RNFS.exists(destPath);
      if (!folderExists) {
        await RNFS.mkdir(destPath);
      }

      // 캡쳐된 임시파일을 저장 경로로 복사
      await RNFS.copyFile(uri, filePath);

      Alert.alert('성공', '이미지가 저장되었습니다!');
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '이미지 저장 중 문제가 발생했습니다.');
    }
  };

  if (!quote) return null;

  return (
    <View style={styles.wrapper}>
      {/* 캡쳐용 뷰를 화면 밖으로 숨김 */}
      <View
        collapsable={false}
        ref={viewRef}
        style={styles.hiddenView}
      >
        <PureQuoteContent
          quoteText={quote.quoteText}
          fontColor={quote.fontColor}
          fontScale={quote.fontScale}
          backgroundId={quote.backgroundId}
          showTitle={true}
          bookTitle={quote.bookTitle}
        />
      </View>

      {/* 화면에 보이는 저장 버튼 */}
      <TouchableOpacity onPress={handleDownload} style={styles.button}>
        <Text style={styles.buttonText}>이미지로 저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DownloadableQuoteCard;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: fixwidth * 0.0,
  },
  hiddenView: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    width: fixwidth, // 캡쳐 시 뷰 크기 지정 필요
    height: fixwidth * 0.6, // PureQuoteContent 예상 높이 맞게 조절
  },
  button: {
    marginTop: fixwidth * 0.0,
    backgroundColor: '#ececec',
    paddingHorizontal: fixwidth * 0.05,
    paddingVertical: fixwidth * 0.0,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Bold',
  },
});
