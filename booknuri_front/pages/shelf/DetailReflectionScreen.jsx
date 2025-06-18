import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import Header from '../../components/public/publicHeader/Header';
import BookMiniHeaderBlock from '../../components/public/bookpublic/BookMiniHeaderBlock';
import TitleOnlyPopup from '../../components/public/publicPopup_Alert_etc/TitleOnlyPopup';

import {
  deleteReflection,
  getMyReflectionById,
  toggleLikeReflection,
} from '../../apis/apiFunction_bookReflection';
import { getBookTotalInfo } from '../../apis/apiFunction_book';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import {useShelf} from '../../contexts/ShelfContext';

const { width: fixwidth } = Dimensions.get('window');

const DetailReflectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [bookInfo, setBookInfo] = useState(null);
  const { reflectionId, isbn13 } = route.params;
  const { removeFromShelf } = useShelf();
  const [reflection, setReflection] = useState(null);
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);

  const fetchReflection = async () => {
    try {
      const reflectionRes = await getMyReflectionById(reflectionId);
      setReflection(reflectionRes.data);
    } catch (err) {
      console.error('❌ 독후감 상세 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const reflectionRes = await getMyReflectionById(reflectionId);
        setReflection(reflectionRes.data);

        const bookRes = await getBookTotalInfo(isbn13);
        setBookInfo(bookRes.data.bookInfo);
      } catch (err) {
        console.error('❌ 데이터 불러오기 실패:', err);
      }
    };

    fetchAllData(); // 컴포넌트 마운트 시 최초 데이터 불러오기

    //화면이 다시 포커스될 때마다 데이터 갱신
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('DetailReflectionScreen이 다시 포커스되었습니다. 데이터를 다시 불러옵니다.');
      fetchAllData();
    });

    // 컴포넌트 언마운트 시 리스너 해제 (메모리 누수 방지)
    return unsubscribe;
  }, [navigation]);

  const handleLikePress = async () => {
    try {
      await toggleLikeReflection(reflection.id);
      fetchReflection(); // 갱신
    } catch (err) {
      console.error('❌ 좋아요 실패:', err);
    }
  };

  const handleEditPress = () => {
    navigation.navigate('ReflectionEditScreen', {
      reflectionId: reflection.id,
      isbn13: isbn13,
    });
  };

  const handleDeletePress = () => {
    setDeletePopupVisible(true); // 팝업 열기
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReflection(reflection.id);
      setDeletePopupVisible(false);
      navigation.goBack();
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
    }
  };

  if (!reflection) {
    return (
      <CommonLayout>
        <Header title="독후감 상세페이지"  />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: fixwidth * 0.035, color: '#999' }}>독후감을 불러오는 중입니다...</Text>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <Header title="독후감 상세페이지" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: fixwidth * 0.047,
          paddingBottom: fixwidth * 0.2,
        }}
      >
        <BookMiniHeaderBlock
          imageUrl={bookInfo?.bookImageURL || ''}
          title={bookInfo?.bookname || '제목 없음'}
          authors={bookInfo?.authors || ''}
        />
        <VerticalGap height={fixwidth * 0.017} />

        {reflection.imageList?.map((imgObj, idx) => (
          <Image
            key={imgObj.id || idx}
            source={{ uri: imgObj.url }}
            style={{
              width: '100%',
              height: fixwidth * 0.5,
              borderRadius: fixwidth * 0.02,
              marginTop: fixwidth * 0.02,
            }}
            resizeMode="contain"
          />
        ))}

        <Text
          style={{
            marginVertical: fixwidth * 0.0337,
            fontSize: fixwidth * 0.051,
            fontFamily: 'NotoSansKR-Bold',
            lineHeight: fixwidth * 0.06,
            color: '#222',
          }}
        >
          {reflection.title}
        </Text>
        <Text
          style={{
            marginTop: fixwidth * 0.02,
            fontSize: fixwidth * 0.037,
            fontFamily: 'NotoSansKR-Regular',
            lineHeight: fixwidth * 0.06,
            color: '#333',
          }}
        >
          {reflection.content}
        </Text>

        <View
          style={{
            marginTop: fixwidth * 0.05,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',


          }}
        >
          <Text
            style={{
              fontSize: fixwidth * 0.037,
              fontFamily: 'NotoSansKR-Light',
              color: '#888',
            }}
          >
            {reflection.createdAt?.slice(0, 10).replace(/-/g, '.')}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleEditPress}>
              <Text
                style={{
                  fontSize: fixwidth * 0.032,
                  fontFamily: 'NotoSansKR-Regular',
                  color: '#666',
                  lineHeight: fixwidth * 0.067,
                }}
              >
                수정
              </Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: fixwidth * 0.015, color: '#ccc' }}>|</Text>
            <TouchableOpacity onPress={handleDeletePress}>
              <Text
                style={{
                  fontSize: fixwidth * 0.032,
                  fontFamily: 'NotoSansKR-Regular',
                  color: '#666',
                  lineHeight: fixwidth * 0.067,
                }}
              >
                삭제
              </Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: fixwidth * 0.015, color: '#ccc' }}>|</Text>
            <TouchableOpacity
              onPress={handleLikePress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: fixwidth * 0.015,
                backgroundColor: 'rgba(147,147,147,0.17)',
                paddingHorizontal: fixwidth * 0.015,
                borderRadius: fixwidth * 0.015,
              }}
            >
              <FontAwesomeIcon
                icon={faHeart}
                size={fixwidth * 0.04}
                color={reflection.likedByCurrentUser ? '#FF6363' : '#d0d0d0'}
              />
              <Text
                style={{
                  fontSize: fixwidth * 0.032,
                  fontFamily: 'NotoSansKR-Regular',
                  color: '#666',
                  lineHeight: fixwidth * 0.067,
                }}
              >
                {reflection.likeCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TitleOnlyPopup
        visible={deletePopupVisible}
        title="이 독후감을 삭제할까요?"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </CommonLayout>
  );
};

export default DetailReflectionScreen;


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: fixwidth * 0.035,
    fontFamily: 'NotoSansKR-Regular',
    color: '#999',
  },
  stars: {
    flexDirection: 'row',
    marginTop: fixwidth * 0.04,
    marginBottom: fixwidth * 0.02,
  },
  image: {
    width: '100%',
    height: fixwidth * 0.5,
    borderRadius: fixwidth * 0.02,
    marginTop: fixwidth * 0.02,
  },
  titleText: {
    marginTop: fixwidth * 0.04,
    fontSize: fixwidth * 0.0487,
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: fixwidth * 0.07,
    color: '#222',
  },
  contentText: {
    marginTop: fixwidth * 0.02,
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.06,
    color: '#333',

  },
  footerRow: {
    marginTop: fixwidth * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  dateText: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Light',
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBtn: {
    fontSize: fixwidth * 0.032,
    fontFamily: 'NotoSansKR-Regular',
    lineHeight:fixwidth * 0.067,
    color: '#666',
  },
  footerSep: {
    marginHorizontal: fixwidth * 0.015,
    color: '#ccc',
  },
  likeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fixwidth * 0.015,
    backgroundColor: 'rgba(147,147,147,0.17)',
    paddingHorizontal: fixwidth * 0.015,
    borderRadius: fixwidth * 0.015,
  },
});
