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
import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import { getBookTotalInfo } from '../../apis/apiFunction_book';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';
import CustomCheckBox from '../../components/public/publicUtil/CustomCheckBox';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import ImageUploaderBox from '../../components/public/etc/ImageUploaderBox';
import {
  checkAlreadyReflected,
  createReflection, getLatestMyReflectionId,
  getMyReflectionByIsbn,
  uploadReflectionImages,
} from '../../apis/apiFunction_bookReflection';
import api from '../../apis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import InputBox from '../../components/public/publicInput/InputBox';
import StarRatingBox from '../../components/public/etc/StarRatingBox';
import TextInputBox from '../../components/public/publicInput/TextInputBox';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import MyIntentModule from '../../MyIntentModule';
import {StackActions} from '@react-navigation/native';


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
  const [title, setTitle] = useState('');
  const [alreadyExistPopupVisible, setAlreadyExistPopupVisible] = useState(false);


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

  const handleNativeChooser = async () => {
    if (images.length >= 3) {
      return;
    }

    try {
      const uri = await MyIntentModule.openChooser(); // 네이티브 chooser 실행
      if (uri && uri !== 'null') {
        setImages((prev) => [...prev, { uri }]); // RN용 이미지 객체로 추가
      }
    } catch (err) {
      console.warn('❌ chooser 실행 실패:', err);
    }
  };



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
      `http://172.18.8.19:8080/book/reflection/image/${reflectionId}/upload`, // 절대경로
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
        transformRequest: (data, headers) => data,
      }
    );

    return response.data;
  };














  const handleSubmit = async () => {
    console.log('--- handleSubmit 시작 ---');
    console.log('초기 상태:');
    console.log('isbn13:', isbn13);
    console.log('title:', title);
    console.log('content 길이:', content.length);
    console.log('rating:', rating);
    console.log('containsSpoiler:', containsSpoiler);
    console.log('visibleToPublic:', visibleToPublic);
    console.log('images 개수:', images.length);

    try {
      //  1. 공개 독후감인지 확인
      console.log('1. 공개 독후감 작성 여부 확인 시작...');
      if (visibleToPublic) {
        console.log('공개 독후감이므로 checkAlreadyReflected 호출...');
        const res = await checkAlreadyReflected(isbn13);
        console.log('checkAlreadyReflected 응답:', res.data);
        if (res.data.alreadyReflected) {
          setAlreadyExistPopupVisible(true); // ❗팝업 띄움
          console.log('❌ 이미 공개 독후감을 작성했습니다. 팝업 표시.');
          return;
        }
        console.log('✅ 공개 독후감 작성 가능.');
      } else {
        console.log('비공개 독후감이므로 작성 여부 확인 건너뜀.');
      }

      //  2. 독후감 작성 시도
      console.log('2. 독후감 작성 시도...');
      const reflectionData = {
        isbn13,
        title,
        content,
        rating,
        containsSpoiler,
        visibleToPublic,
      };
      console.log('createReflection에 보낼 데이터:', reflectionData);

      const createResponse = await createReflection(reflectionData);
      console.log('createReflection 응답:', createResponse.data);
      console.log('✅ 독후감 작성 성공.');

      // 3. 작성 후 ID 조회: getMyReflectionByIsbn 대신 getLatestMyReflectionId 사용
      console.log('3. 독후감 ID 조회 시작...');
      console.log('getLatestMyReflectionId 호출 (isbn13:', isbn13, ')');
      const latestIdRes = await getLatestMyReflectionId(isbn13);
      console.log('getLatestMyReflectionId 응답:', latestIdRes.data);

      const reflectionId = latestIdRes?.data?.reflectionId;
      console.log('추출된 reflectionId:', reflectionId);

      if (!reflectionId) {
        console.log('❌ reflectionId를 찾을 수 없습니다. 함수 종료.');
        Alert.alert("오류", "독후감 저장 후 ID를 찾을 수 없어요.");
        return;
      }
      console.log('✅ reflectionId 성공적으로 획득:', reflectionId);

      //  4. 이미지 업로드
      console.log('4. 이미지 업로드 시작...');
      if (images.length > 0) {
        console.log(`${images.length}개의 이미지 업로드 시도 (reflectionId: ${reflectionId})...`);
        await uploadReflectionImages(reflectionId, images);
        console.log('✅ 이미지 업로드 성공.');
      } else {
        console.log('업로드할 이미지가 없습니다. 이미지 업로드 건너뜀.');
      }

      //  5. 화면 이동
      console.log('5. 화면 이동 시작...');
      navigation.dispatch(StackActions.pop(1));
      console.log('✅ 독후감 작성 및 처리 완료. 이전 화면으로 이동.');

    } catch (err) {
      console.log('--- ❌ 독후감 작성 에러 발생 ---');
      console.log('에러 객체:', err);
      console.log('에러 메시지:', err.message);
      if (err.response) {
        console.log('에러 응답 데이터 (err.response.data):', err.response.data);
        console.log('에러 응답 상태 (err.response.status):', err.response.status);
        console.log('에러 응답 헤더 (err.response.headers):', err.response.headers);
      }
      Alert.alert("작성 실패", `독후감 작성 중 오류가 발생했어요: ${err.response?.data?.message || err.message}`);
    }
    console.log('--- handleSubmit 종료 (에러 발생 또는 성공) ---');
  };

  const handleAddImage = async (fromCamera = false) => {
    if (images.length >= 3) {
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

  const handleSelectImage = async () => {
    if (images.length >= 3) return;

    const options = { mediaType: 'photo', quality: 0.8 };
    const result = await launchImageLibrary(options);

    if (result.assets?.length) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
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
              <VerticalGap height={fixwidth*0.003} />

              {/* 별점 ⭐ */}
              <StarRatingBox
                value={rating}
                onChange={setRating}
              />

              <VerticalGap height={fixwidth*0.003} />

              {/* 제목 입력 (InputBox는 그대로) */}
              <InputBox
                placeholder="제목을 입력하세요"
                maxLength={50}
                inputHeight={fixwidth * 0.11}
                value={title}
                onChangeText={setTitle}
              />



              {/* 본문 작성 ✍ */}
              <TextInputBox
                placeholder="최대 3000자까지 작성 가능"
                maxLength={3000}
                inputHeight={fixwidth * 0.5}
                value={content}
                onChangeText={setContent}
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
                <ImageUploaderBox imageCount={images.length} onPress={handleNativeChooser} />


                <View style={styles.imagePreviewWrap}>
                  {images.map((img, idx) => (
                    <TouchableOpacity key={idx} onLongPress={() => confirmDeleteImage(idx)}>
                      <Image source={{ uri: img.uri }} style={styles.previewImage} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <VerticalGap height={fixwidth*0.003} />

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
          <TitleOnlyPopup
            visible={alreadyExistPopupVisible}
            title="이미 공개 독후감을 작성했어요"
            onCancel={() => setAlreadyExistPopupVisible(false)}
            onConfirm={() => setAlreadyExistPopupVisible(false)}
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
    paddingHorizontal: fixwidth * 0.04,
    backgroundColor: '#fff',
  },
  innerContainer: {
    gap: fixwidth * 0.017,
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
    width: fixwidth * 0.2,
    height: fixwidth * 0.2,
    borderRadius: fixwidth * 0.015,
    backgroundColor: '#eee',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
