import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import { LoginContext } from '../../contexts/LoginContextProvider';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import SearchInput from '../../components/home/SearchInput';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import PrivateRecommendBannerCarousel from '../../components/home/PrivateRecommendBannerCarousel';
import SectionHeaderWithIcon from '../../components/public/publicHeader/SectionHeaderWithIcon';

const { fixwidth, height } = Dimensions.get("window");

const HomeScreen = () => {
    const { userInfo } = useContext(LoginContext);

    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');
    const [libName, setLibName] = useState('');
    const [libCode, setLibCode] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

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
                    onFocusChange={setSearchFocused}
                  />
              </View>

              {!searchFocused && (
                <>
                    <VerticalGap />

                    <VerticalGap height={fixwidth*0.017}/>
                    <PrivateRecommendBannerCarousel /> {/* 🔥 여기 삽입 */}




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
        paddingTop: fixwidth * 0.01,
        minHeight: height,
        backgroundColor: "#ffffff",
    },
    titleText: {
        fontSize: fixwidth * 0.05,
        fontWeight: '700',
        marginVertical: fixwidth * 0.03,
    },
    infoBox: {
        width: '90%',
        backgroundColor: '#f5f5f5',
        borderRadius: fixwidth * 0.03,
        padding: fixwidth * 0.05,
    },
    infoText: {
        fontSize: fixwidth * 0.038,
        marginBottom: fixwidth * 0.01,
    },
});
