import React, {useContext, useEffect, useRef, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import CommonLayout from '../../components/public/publicUtil/CommonLayout';
import { LoginContext } from '../../contexts/LoginContextProvider';
import HomeHeader from '../../components/public/publicHeader/HomeHeader';
import SearchInput from '../../components/home/SearchInput';
import PrivateRecommendBannerCarousel from '../../components/home/PrivateRecommendBannerCarousel';
import SectionHeaderWithIcon from '../../components/public/publicHeader/SectionHeaderWithIcon';
import BestsellerRecommendationBlock from '../../components/home/BestsellerRecommendationBlock';
import DividerBlock from '../../components/public/publicUtil/DividerBlock';
import VerticalGap from '../../components/public/publicUtil/VerticalGap';
import ScrollToTopButton from '../../components/public/publicUtil/ScrollToTopButton';
import DemographicRecommendationBlock from '../../components/home/DemographicRecommendationBlock';

const { width: fixwidth, height } = Dimensions.get("window");

const HomeScreen = () => {
    const { userInfo } = useContext(LoginContext);

    const scrollRef = useRef(null);

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
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
              <View style={{ width: '100%'  }}>
                  <SearchInput
                    libCode={libCode}
                    onFocusChange={setSearchFocused}
                  />
              </View>

              {!searchFocused && (
                <>




                    <VerticalGap/>



                    <PrivateRecommendBannerCarousel />


                    <View style={styles.horizontalLine} />

                    <BestsellerRecommendationBlock />



                    <View style={styles.horizontalLine} />

                    <DemographicRecommendationBlock />







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

          {!searchFocused && (
            <ScrollToTopButton
              onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            />
          )}
      </CommonLayout>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // ✅ 요게 핵심!!!
        alignItems: 'center',
        paddingTop: fixwidth * 0.01,
        paddingBottom: fixwidth * 0.2, // 하단 스크롤 여유
        backgroundColor: '#ffffff',
    },

    horizontalLine: {
        width: '94%', // 부모 기준으로 가득
        height: fixwidth*0.00097,     // 두께
        backgroundColor: 'rgba(0,0,0,0.27)', // 회색 선
        marginVertical: fixwidth*0.057, // 위아래 여백 (원하면 조절)
    },



});
