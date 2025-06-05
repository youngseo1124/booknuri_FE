import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CommonLayout from '../components/public/publicUtil/CommonLayout';
import Header from '../components/public/publicHeader/Header';
import { LoginContext } from '../contexts/LoginContextProvider';
import HomeHeader from '../components/public/publicHeader/HomeHeader';
import SearchInput from '../components/home/SearchInput';
import VerticalGap from '../components/public/publicUtil/VerticalGap';

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
    const { userInfo } = useContext(LoginContext);

    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');
    const [libName, setLibName] = useState('');
    const [libCode, setLibCode] = useState('');
    const [searchFocused, setSearchFocused] = useState(false); // 🔍 상태관리

    useEffect(() => {
        if (userInfo) {
            const birthYear = Math.floor(userInfo.birth / 10000);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            const decade = Math.floor(age / 10) * 10;
            setAgeGroup(`${decade}대`);
            setGender(userInfo.gender === 'F' ? '여성' : '남성');
            setLibName(userInfo.myLibrary?.libName || '');
            setLibCode(userInfo.myLibrary?.libCode || '');
        }
    }, [userInfo]);

    return (
      <CommonLayout>
          <HomeHeader title={libName || '마이 홈'} />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
              <View style={{ width: '100%' }}>
                  <SearchInput
                    libCode={libCode}
                    onSearchSubmit={(keyword) => console.log('🔍 검색:', keyword)}
                    onFocusChange={setSearchFocused} // 🔥 연결 포인트
                  />
              </View>

              {!searchFocused && ( // 🔥 검색 포커스 중엔 아래 숨김
                <>
                    <VerticalGap />
                    <Text style={styles.titleText}>🎉 홈화면</Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>👤 닉네임: {userInfo?.nickname}</Text>
                        <Text style={styles.infoText}>🎂 연령대: {ageGroup}</Text>
                        <Text style={styles.infoText}>🚻 성별: {gender}</Text>
                        <Text style={styles.infoText}>🏛️ 도서관: {libName}</Text>
                        <Text style={styles.infoText}>📘 도서관 코드: {libCode}</Text>
                    </View>
                </>
              )}
          </ScrollView>
      </CommonLayout>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: "center",
        paddingTop: width * 0.01,
        minHeight: height,
        backgroundColor: "#ffffff",
    },
    titleText: {
        fontSize: width * 0.05,
        fontWeight: '700',
        marginVertical: width * 0.03,
    },
    infoBox: {
        width: '90%',
        backgroundColor: '#f5f5f5',
        borderRadius: width * 0.03,
        padding: width * 0.05,
    },
    infoText: {
        fontSize: width * 0.038,
        marginBottom: width * 0.01,
    },
});
