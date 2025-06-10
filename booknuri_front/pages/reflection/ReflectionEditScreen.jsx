import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions,
  ScrollView, ActivityIndicator, Image, Alert, TouchableOpacity,
} from 'react-native';

import Header from '../../components/public/publicHeader/Header';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import { getBookTotalInfo } from '../../apis/apiFunction_book';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';
import CustomCheckBox from '../../components/public/publicUtil/CustomCheckBox';
import WriteButton from '../../components/public/publicButton/WriteButton';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';
import ImageUploaderBox from '../../components/public/etc/ImageUploaderBox';
import {
  getMyReflectionById,
  updateReflection,
} from '../../apis/apiFunction_bookReflection';
import InputBox from '../../components/public/publicInput/InputBox';
import TextInputBox from '../../components/public/publicInput/TextInputBox';
import StarRatingBox from '../../components/public/etc/StarRatingBox';
import MyIntentModule from '../../MyIntentModule';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerticalGap from "../../components/public/publicUtil/VerticalGap";
import { StackActions } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const ReflectionEditScreen = ({ route, navigation }) => {
  const { reflectionId } = route.params;
  const{isbn13}=route.params;

  console.log("📦 reflectionId:", reflectionId);

  const [bookData, setBookData] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [visibleToPublic, setVisibleToPublic] = useState(true);
  const [images, setImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [imageToDeleteIdx, setImageToDeleteIdx] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reflectionRes = await getMyReflectionById(reflectionId);
        const reflection = reflectionRes.data;
        const bookRes = await getBookTotalInfo(isbn13);

        setBookData(bookRes.data.bookInfo);
        setTitle(reflection.title);
        setContent(reflection.content);
        setRating(reflection.rating);
        setContainsSpoiler(reflection.containsSpoiler);
        setVisibleToPublic(reflection.visibleToPublic);
        setImages(reflection.imageList.map(img => ({
          uri: img.url,
          isNew: false,
          id: img.id,
        })));

        setIsReady(true);
      } catch (error) {
        console.log('❌ 데이터 불러오기 실패', error);
        Alert.alert("불러오기 실패", "독후감 정보를 불러오지 못했어요.");
      }
    };

    fetchData();
  }, [reflectionId]);

  const confirmDeleteImage = (index) => {
    setImageToDeleteIdx(index);
    setDeletePopupVisible(true);
  };

  const deleteImage = () => {
    const target = images[imageToDeleteIdx];
    if (!target.isNew) {
      setDeletedImageIds(prev => [...prev, target.id]);
    }
    const newImages = [...images];
    newImages.splice(imageToDeleteIdx, 1);
    setImages(newImages);
    setDeletePopupVisible(false);
  };

  const handleNativeChooser = async () => {
    if (images.length >= 3) return;
    try {
      const uri = await MyIntentModule.openChooser();
      if (uri && uri !== 'null') {
        setImages(prev => [...prev, { uri, isNew: true }]);
      }
    } catch (err) {
      console.warn('❌ chooser 실패:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateReflection({
        reflectionId,
        content,
        rating,
        containsSpoiler,
        visibleToPublic,
        title,
      });

      const accessToken = await AsyncStorage.getItem('accessToken');
      const uniqueDeletedImageIds = [...new Set(deletedImageIds)];

      for (const imageId of uniqueDeletedImageIds) {
        try {
          console.log("📤 삭제 요청 전송:", imageId);
          await axios({
            method: 'delete',
            url: `http://172.18.8.19:8080/book/reflection/image/${imageId}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log("✅ 삭제 성공:", imageId);
        } catch (e) {
          console.warn("❌ 삭제 실패:", imageId, e.response?.data || e.message);
        }
      }

      const newImages = images.filter(img => img.isNew);
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img, idx) => {
          formData.append('images', {
            uri: img.uri,
            name: img.fileName || `reflection_${idx}.jpg`,
            type: img.type || 'image/jpeg',
          });
        });

        await axios.post(
          `http://172.18.8.19:8080/book/reflection/image/${reflectionId}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
            transformRequest: (data, headers) => data,
          }
        );
      }

      navigation.dispatch(StackActions.pop(1));

    } catch (err) {
      console.log('❌ 수정 실패:', err.response?.data || err.message || err);
      Alert.alert("실패", "독후감 수정에 실패했어요.");
    }
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
          <Header title="독후감 수정" />
          <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
              <BookMiniHeaderBlock
                imageUrl={bookData.bookImageURL}
                title={bookData.bookname}
                authors={bookData.authors}
              />
              <VerticalGap height={fixwidth * 0.003} />
              <StarRatingBox value={rating} onChange={setRating} />
              <VerticalGap height={fixwidth * 0.003} />
              <InputBox
                placeholder="제목을 입력하세요"
                maxLength={30}
                inputHeight={fixwidth * 0.11}
                value={title}
                onChangeText={setTitle}
              />
              <TextInputBox
                placeholder="최대 3000자까지 작성 가능"
                maxLength={3000}
                inputHeight={fixwidth * 0.5}
                value={content}
                onChangeText={setContent}
              />
              <CustomCheckBox label="스포일러 포함" value={containsSpoiler} onChange={setContainsSpoiler} />
              <CustomCheckBox label="공개 독후감" value={visibleToPublic} onChange={setVisibleToPublic} />

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

              <VerticalGap height={fixwidth * 0.003} />

              <WriteButton
                label="수정 완료"
                onPress={() => {
                  if (rating === 0 || content.trim() === '') return;
                  setConfirmVisible(true);
                }}
              />
            </View>
          </ScrollView>

          <TitleOnlyPopup
            visible={confirmVisible}
            title="수정된 독후감을 저장할까요?"
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

export default ReflectionEditScreen;

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
