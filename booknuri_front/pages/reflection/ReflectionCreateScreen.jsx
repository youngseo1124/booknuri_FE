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
import CustomCheckBox from '../../components/public/publicButton/CustomCheckBox';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import ImageUploaderBox from '../../components/public/etc/ImageUploaderBox';
import {createReflection, getMyReflectionByIsbn, uploadReflectionImages} from '../../apis/apiFunction_bookReflection';
import api from '../../apis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import InputBox from '../../components/public/publicInput/InputBox';
import StarRatingBox from '../../components/public/etc/StarRatingBox';
import TextInputBox from '../../components/public/publicInput/TextInputBox';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import MyIntentModule from '../../MyIntentModule';


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
      `http://192.168.0.13:8080/book/reflection/image/${reflectionId}/upload`, // 절대경로
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
    try {
      await createReflection({
        isbn13,
        title,
        content,
        rating,
        containsSpoiler,
        visibleToPublic,
      });
    } catch (err) {
    }

    try {

      const res = await getMyReflectionByIsbn(isbn13);
      const reflectionId = res?.data?.reflectionId || res?.data?.id; // 둘 다 대비 가능하게!

      if (!reflectionId) {
        return;
      }

      //  이미지 업로드
      if (images.length > 0) {
        await uploadReflectionImages(reflectionId, images);
      }

      //  완료 후 이동
      navigation.replace("BookDetailScreen", { isbn: isbn13 });
    } catch (e) {
      console.log(" 에러 발생:", e.response?.data || e.message);

    }
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
