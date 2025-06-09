import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useContext } from 'react';
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
            animation: 'fade_from_bottom',
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

                </>
            )}
        </Stack.Navigator>
    );
};

// 최종 App (Provider만 감쌈)
const App = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <SafeAreaProvider>
                <LoginContextProvider>

                    <BannerRefreshProvider>
                        <BannerPageProvider>
                            <AppInner />
                        </BannerPageProvider>
                    </BannerRefreshProvider>
                </LoginContextProvider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
};

export default App;
