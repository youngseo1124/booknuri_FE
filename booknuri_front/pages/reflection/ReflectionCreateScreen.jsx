import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/public/Header';
import CommonLayout from '../../components/public/CommonLayout';
import { getBookTotalInfo } from '../../apis/apiFunction_book';
import BookMiniHeaderBlock from '../../components/bookpublic/BookMiniHeaderBlock';
import ReviewFormBlock from '../../components/bookDetailpage/ReviewWriteFormBlock';
import CustomCheckBox from '../../components/bookpublic/CustomCheckBox';
import WriteButton from '../../components/bookpublic/WriteButton';
import TitleOnlyPopup from '../../components/public/TitleOnlyPopup';
import ImageUploaderBox from '../../components/bookpublic/ImageUploaderBox';
import {createReflection, uploadReflectionImages} from '../../apis/apiFunction_bookReflection';
import api from '../../apis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const { width: fixwidth } = Dimensions.get('window');

const ReflectionCreateScreen = ({ route, navigation }) => {
  const { isbn13 } = route.params;

  const [bookData, setBookData] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [visibleToPublic, setVisibleToPublic] = useState(true);
  const [images, setImages] = useState([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [imageToDeleteIdx, setImageToDeleteIdx] = useState(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const res = await getBookTotalInfo(isbn13);
        setBookData(res.data.bookInfo);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setIsReady(true);
      } catch (error) {
        console.error('❌ 책 정보 로딩 실패:', error);
      }
    };
    fetchBookData();
  }, [isbn13]);



  const uploadReflectionImages = async (reflectionId, images) => {
    console.log("🔥 reflectionId:", reflectionId);
    const formData = new FormData();

    images.forEach((img, idx) => {
      formData.append('images', {
        uri: img.uri,
        name: img.fileName || `reflection_${idx}.jpg`,
        type: img.type || 'image/jpeg',
      });
    });

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await axios.post(
      `http://172.18.10.128:8080/book/reflection/image/${reflectionId}/upload`, // 절대경로
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`, // ✅ 토큰 직접 붙이기
        },
        transformRequest: (data, headers) => data, // ✅ FormData 그대로 전달
      }
    );

    console.log('🔥 accessToken:', accessToken);
    console.log('✅이미지 업로드 응답:', response.data);
    return response.data;
  };














  const handleSubmit = async () => {
    try {
      // 1️. 일단 작성 시도
      await createReflection({
        isbn13,
        content,
        rating,
        containsSpoiler,
        visibleToPublic,
      });
    } catch (err) {
      // 작성 실패해도 무시하고 진행 (이미 작성된 경우 포함)
      console.log("✅ 독후감 작성 실패 but 계속 진행:", err?.response?.data?.message);
    }

    try {
      // 2️. 내 독후감 다시 조회해서 reflectionId 확보
      const res = await api.get(`/book/reflection/my/${isbn13}`);
      const reflectionId = res?.data?.id;
      console.log("📌 가져온 reflectionId:", reflectionId);

      if (!reflectionId) {
        Alert.alert("실패", "독후감 ID를 가져오지 못했어요.");
        return;
      }

      // 3️. 이미지 업로드
      if (images.length > 0) {
        await uploadReflectionImages(reflectionId, images);
      }

      // 4️. 완료 후 이동
      navigation.replace("BookDetailScreen", { isbn: isbn13 });
    } catch (e) {
      console.log("❌ 에러 발생:", e.response?.data || e.message);
      Alert.alert("에러", e.response?.data?.message || "알 수 없는 오류");
    }
  };


  const handleAddImage = async (fromCamera = false) => {
    if (images.length >= 3) {
      Alert.alert('최대 3장까지 업로드할 수 있어요!');
      return;
    }

    const options = { mediaType: 'photo', quality: 0.8 };
    const result = fromCamera
      ? await launchCamera(options)
      : await launchImageLibrary(options);

    if (result.assets?.length) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

  const openImageSelectPopup = () => {
    Alert.alert('이미지 추가', '어떻게 추가할까요?', [
      { text: '카메라', onPress: () => handleAddImage(true) },
      { text: '앨범에서 선택', onPress: () => handleAddImage(false) },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const confirmDeleteImage = (index) => {
    setImageToDeleteIdx(index);
    setDeletePopupVisible(true);
  };

  const deleteImage = () => {
    const newImages = [...images];
    newImages.splice(imageToDeleteIdx, 1);
    setImages(newImages);
    setDeletePopupVisible(false);
  };

  if (!isReady) {
    return (
      <CommonLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header title="독후감 작성" />
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <BookMiniHeaderBlock
                imageUrl={bookData.bookImageURL}
                title={bookData.bookname}
                authors={bookData.authors}
              />
              <ReviewFormBlock
                placeholder="최대 500자까지 작성 가능"
                maxLength={500}
                inputHeight={fixwidth * 0.55}
                onRatingChange={setRating}
                onTextChange={setContent}
              />
              <CustomCheckBox
                label="스포일러 포함"
                value={containsSpoiler}
                onChange={setContainsSpoiler}
              />
              <CustomCheckBox
                label="공개 독후감"
                value={visibleToPublic}
                onChange={setVisibleToPublic}
              />
              <View style={styles.imageArea}>
                <ImageUploaderBox imageCount={images.length} onPress={openImageSelectPopup} />
                <View style={styles.imagePreviewWrap}>
                  {images.map((img, idx) => (
                    <TouchableOpacity key={idx} onLongPress={() => confirmDeleteImage(idx)}>
                      <Image source={{ uri: img.uri }} style={styles.previewImage} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <WriteButton
                label="독후감 작성"
                onPress={() => {
                  if (rating === 0 || content.trim() === '') return;
                  setConfirmVisible(true);
                }}
              />
            </View>
          </ScrollView>

          <TitleOnlyPopup
            visible={confirmVisible}
            title="독후감을 등록할까요?"
            onCancel={() => setConfirmVisible(false)}
            onConfirm={() => {
              setConfirmVisible(false);
              handleSubmit();
            }}
          />

          <TitleOnlyPopup
            visible={deletePopupVisible}
            title="이미지를 삭제할까요?"
            onCancel={() => setDeletePopupVisible(false)}
            onConfirm={deleteImage}
          />
        </View>
      </TouchableWithoutFeedback>
    </CommonLayout>
  );
};

export default ReflectionCreateScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: fixwidth * 0.05,
    paddingHorizontal: fixwidth * 0.06,
    backgroundColor: '#fff',
  },
  innerContainer: {
    gap: fixwidth * 0.037,
  },
  imageArea: {
    flexDirection: 'row',
    gap: fixwidth * 0.03,
    alignItems: 'flex-start',
  },
  imagePreviewWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: fixwidth * 0.02,
    flex: 1,
  },
  previewImage: {
    width: fixwidth * 0.15,
    height: fixwidth * 0.17,
    borderRadius: fixwidth * 0.015,
    backgroundColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
