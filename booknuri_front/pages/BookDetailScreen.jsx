// pages/book/BookDetailScreen.jsx

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import CommonLayout from '../components/public/CommonLayout';
import Header from '../components/public/Header';
import {getBookTotalInfo} from '../apis/apiFunction_book';
import BookInfoHeaderBlock from '../components/bookDetailpage/BookInfoHeaderBlock';
import BookInfoContentBlock from '../components/bookDetailpage/BookInfoContentBlock';
import DividerBlock from '../components/public/DividerBlock';
const { width: fixwidth } = Dimensions.get('window');


const BookDetailScreen = ({ route }) => {
    const { isbn } = route.params;
    const [bookData, setBookData] = useState(null); //  전체 책 정보 저장
    const [loading, setLoading] = useState(true);   // 로딩 상태

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const res = await getBookTotalInfo(isbn);
                setBookData(res.data);
            } catch (error) {
                console.error('X 책 상세 정보 가져오기 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [isbn]);

    return (
        <CommonLayout>
            <Header title="책 상세 페이지"/>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >

                <BookInfoHeaderBlock bookInfo={bookData?.bookInfo} />

                <DividerBlock />

                <BookInfoContentBlock description={bookData?.bookInfo?.description}/>

                <DividerBlock />


                {/*  이후 책 제목, 저자, 출판사, 줄거리 등 추가해도 스크롤됨 */}
            </ScrollView>
        </CommonLayout>
    );
};

export default BookDetailScreen;

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingVertical: fixwidth * 0.02,
    },

    divider: {
        width: '100%',
        height: fixwidth * 0.057,
        backgroundColor: '#f3f3f3',
    },
});
