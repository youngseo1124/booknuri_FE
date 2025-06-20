import { enableScreens } from 'react-native-screens';
enableScreens();

import React, {useContext, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './navigation/RootNavigation';

// Context
import LoginContextProvider, { LoginContext } from './contexts/LoginContextProvider';

//  화면들
import LoadingScreen from './pages/LoadingScreen';
import LoginScreen from './pages/login&join/LoginScreen';
import Signup00Screen from './pages/login&join/Signup00Screen';
import Signup01Screen from './pages/login&join/Signup01Screen';
import FirstSettingScreen from './pages/firstSetting/FirstSettingScreen';
import HomeScreen from './pages/home/HomeScreen';
import MyLibrarySettingScreen from './pages/setting/MyLibrarySettingScreen';
import TabNavigator from './navigation/TabNavigator';
import ScanScreen from './pages/ScanScreen.jsx';
import BookDetailScreen from './pages/BookDetailScreen';
import ReviewCreateScreen from './pages/review/ReviewCreateScreen';
import ReviewEditScreen from './pages/review/ReviewEditScreen';
import BookReviewListScreen from './pages/review/BookReviewListScreen';
import ReflectionCreateScreen from './pages/reflection/ReflectionCreateScreen';
import ReflectionEditScreen from './pages/reflection/ReflectionEditScreen';
import ReflectionListScreen from './pages/reflection/BookReflectionListScreen';
import BookQuoteCreateScreen from './pages/quote/BookQuoteCreateScreen';
import BookQuoteEditScreen from './pages/quote/BookQuoteEditScreen';
import QuoteCaptureScreen from './pages/quote/QuoteCaptureScreen';
import OCRScreen from './pages/quote/OCRScreen';
import BookQuoteListScreen from './pages/quote/BookQuoteListScreen';
import BookSearchResultScreen from './pages/home/BookSearchResultScreen';
import {BannerRefreshProvider} from './contexts/BannerRefreshContext';
import {BannerPageProvider} from './contexts/BannerPageContext';
import ShelfBookDetailSettingScreen from './pages/shelf/ShelfBookDetailSettingScreen';
import MyQuotesScreen from './pages/shelf/MyQuotesScreen';
import MyReflectionsScreen from './pages/shelf/MyReflectionsScreen';
import DetailReflectionScreen from './pages/shelf/DetailReflectionScreen';
import MyReviewsScreen from './pages/shelf/MyReviewsScreen';
import {ShelfProvider} from './contexts/ShelfContext';
import CalendarScreen from './pages/calendar/CalendarScreen';
import DayDetailScreen from './pages/calendar/DayDetailScreen';
import MyLibraryEditScreen from './pages/mypage/MyLibraryEditScreen';
import {RecentViewedBooksProvider} from './contexts/RecentViewedBooksContextProvider';
import {LogBox} from 'react-native';

const Stack = createStackNavigator();

//  네비게이션 조건 분기 컴포넌트
const AppInner = () => {
    const { isLoading, isLogin, userInfo } = useContext(LoginContext);

    const isSettingIncomplete =
        !userInfo?.gender || userInfo?.gender === '' ||
        userInfo?.birth == null || userInfo?.myLibrary == null;

    return (
      <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}
      >
            {isLoading && (
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            )}
            {!isLoading && !isLogin && (
                <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="Signup00Screen" component={Signup00Screen} />
                    <Stack.Screen name="Signup01Screen" component={Signup01Screen} />
                </>
            )}
            {!isLoading && isLogin && isSettingIncomplete && (
                <>
                    <Stack.Screen name="FirstSettingScreen" component={FirstSettingScreen} />

                </>
            )}
            {!isLoading && isLogin && !isSettingIncomplete && (
                <>
                    <Stack.Screen name="MainTab" component={TabNavigator} />
                    <Stack.Screen name="ScanScreen" component={ScanScreen} />

                    <Stack.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />
                    <Stack.Screen name="BookDetailScreen" component={BookDetailScreen} />
                    <Stack.Screen name="ReviewCreateScreen" component={ReviewCreateScreen} />
                    <Stack.Screen name="ReviewEditScreen" component={ReviewEditScreen} />
                    <Stack.Screen name="BookReviewListScreen" component={BookReviewListScreen} />

                    <Stack.Screen name="ReflectionCreateScreen" component={ReflectionCreateScreen} />
                    <Stack.Screen name="ReflectionEditScreen" component={ReflectionEditScreen} />
                    <Stack.Screen name="ReflectionListScreen" component={ReflectionListScreen} />

                    <Stack.Screen name="BookQuoteCreateScreen" component={BookQuoteCreateScreen} />
                    <Stack.Screen name={"BookQuoteEditScreen"} component={BookQuoteEditScreen} />
                    <Stack.Screen name={"QuoteCaptureScreen"} component={QuoteCaptureScreen} />
                    <Stack.Screen name={"BookQuoteListScreen"} component={BookQuoteListScreen} />

                    <Stack.Screen name={"OCRScreen"} component={OCRScreen} />

                    <Stack.Screen name={"BookSearchResultScreen"} component={BookSearchResultScreen} />

                    <Stack.Screen name="ShelfBookDetailSettingScreen" component={ShelfBookDetailSettingScreen} />

                    <Stack.Screen name="MyQuotesScreen" component={MyQuotesScreen} />

                   <Stack.Screen name="MyReflectionsScreen" component={MyReflectionsScreen} />

                  <Stack.Screen name="DetailReflectionScreen" component={DetailReflectionScreen} />

                  <Stack.Screen name="MyReviewsScreen" component={MyReviewsScreen} />

                  <Stack.Screen name="DayDetailScreen" component={DayDetailScreen}/>

                  <Stack.Screen name="MyLibraryEditScreen" component={MyLibraryEditScreen}/>
                </>
            )}
        </Stack.Navigator>
    );
};

// 최종 App (Provider만 감쌈)
const App = () => {


  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <BannerPageProvider>
          <LoginContextProvider>
            <BannerRefreshProvider>
              <RecentViewedBooksProvider>
                <ShelfProvider>
                  <AppInner />
                </ShelfProvider>
              </RecentViewedBooksProvider>
            </BannerRefreshProvider>
          </LoginContextProvider>
        </BannerPageProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
