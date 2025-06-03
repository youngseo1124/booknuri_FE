import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import OCRTextBox from '../../components/public/publicInput/OCRTextBox';
import MyIntentModule from '../../MyIntentModule';
import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';

const { width: fixwidth } = Dimensions.get('window');

const OCRScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [imageUri, setImageUri] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  const callGoogleOCR = async (base64) => {
    try {
      setLoading(true);
      setOcrText('');
      const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBxhLXOV1wnCS_K54EecfyH6ZbXaZez9HU`, {

        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        }),
      });
      console.log('📡 응답 상태:', res.status);

      const errorText = await res.text();
      console.log('❗에러 응답 내용:', errorText);

      const result = await res.json();
      const text = result.responses?.[0]?.textAnnotations?.[0]?.description;
      if (text) {
        setOcrText(text);
      } else {
        setOcrText('텍스트를 인식하지 못했어요.');
      }
    } catch (err) {
      console.error('❌ OCR 오류:', err);
      setOcrText('OCR 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async (fromCamera = false) => {
    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo', quality: 0.8, includeBase64: true })
      : await launchImageLibrary({ mediaType: 'photo', quality: 0.8, includeBase64: true });

    if (result.assets?.length) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      callGoogleOCR(asset.base64);
    }
  };

  const handleNativeChooser = async () => {
    try {
      const uri = await MyIntentModule.openChooser(); // Android 네이티브 chooser
      if (uri && uri !== 'null') {
        const result = await fetch(uri);

        const blob = await result.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          setImageUri(uri);
          callGoogleOCR(base64);
        };
        reader.readAsDataURL(blob);
      }
    } catch (e) {
      console.error('❌ chooser 실패:', e);
      Alert.alert('이미지 선택 실패', '이미지를 가져오는 중 문제가 발생했습니다.');
    }
  };

  const handleSubmit = () => {
    if (!ocrText.trim()) return;
    navigation.replace('BookQuoteCreateScreen', {
      isbn13,
      returnScreenName: 'BookDetailScreen',
      prefillText: ocrText,
    });
  };

  return (
    <CommonLayout>
      <Header title="OCR 인용 추출" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePickImage(true)}>
            <Text style={styles.buttonText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePickImage(false)}>
            <Text style={styles.buttonText}>앨범</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleNativeChooser}>
            <Text style={styles.buttonText}>Chooser</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#444" style={{ marginVertical: 20 }} />
        ) : (
          <OCRTextBox value={ocrText} />
        )}

        {!!ocrText.trim() && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>인용으로 보내기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </CommonLayout>
  );
};

export default OCRScreen;

const styles = StyleSheet.create({
  scrollContent: {
    padding: fixwidth * 0.05,
    backgroundColor: '#FCF9F0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: fixwidth * 0.04,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#A8CA47',
    marginHorizontal: 4,
    paddingVertical: fixwidth * 0.03,
    borderRadius: fixwidth * 0.02,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    fontFamily: 'NotoSansKR-Medium',
    color: '#fff',
    fontSize: fixwidth * 0.035,
  },
  previewImage: {
    width: '100%',
    height: fixwidth * 0.7,
    resizeMode: 'cover',
    marginBottom: fixwidth * 0.05,
    borderRadius: fixwidth * 0.02,
    borderWidth: 1,
    borderColor: '#222',
  },
  submitButton: {
    backgroundColor: '#617AF5',
    paddingVertical: fixwidth * 0.035,
    borderRadius: fixwidth * 0.02,
    alignItems: 'center',
    marginTop: fixwidth * 0.05,
  },
});
