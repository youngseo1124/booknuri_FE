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
import FirstSettingStep01Screen from './pages/firstSetting/FirstSettingStep01Screen';
import FirstSettingStep02Screen from './pages/firstSetting/FirstSettingStep02Screen';
import FirstSettingStep03Screen from './pages/firstSetting/FirstSettingStep03Screen';
import HomeScreen from './pages/HomeScreen';
import MyLibrarySettingScreen from './pages/setting/MyLibrarySettingScreen';
import TabNavigator from './navigation/TabNavigator';
import ScanScreen from './pages/ScanScreen.jsx'; 

const Stack = createStackNavigator();

//  네비게이션 조건 분기 컴포넌트
const AppInner = () => {
    const { isLoading, isLogin, userInfo } = useContext(LoginContext);

    const isSettingIncomplete =
        !userInfo?.gender || userInfo?.gender === '' ||
        userInfo?.birth == null || userInfo?.myLibrary == null;

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
                    <Stack.Screen name="FirstSettingStep01Screen" component={FirstSettingStep01Screen} />
                    <Stack.Screen name="FirstSettingStep02Screen" component={FirstSettingStep02Screen} />
                    <Stack.Screen name="FirstSettingStep03Screen" component={FirstSettingStep03Screen} />
                </>
            )}
            {!isLoading && isLogin && !isSettingIncomplete && (
                <>
                    <Stack.Screen name="MainTab" component={TabNavigator} />
                    <Stack.Screen name="ScanScreen" component={ScanScreen} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />
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
                    <AppInner />
                </LoginContextProvider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
};

export default App;
