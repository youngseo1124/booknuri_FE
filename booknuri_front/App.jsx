/*
*
* <앱 처음 실행시>
* storage에서 isLogin === true && accessToken 유효하면 → HomeScreen
* accessToken 없거나 만료 → LoginScreen
* userInfo.gender / birthYear 없으면 → FirstSettingStep01Screen
*
*/

import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef, reset } from './navigation/RootNavigation'; // ✅ reset 함수도 가져오기

// 페이지들
import LoadingScreen from './pages/LoadingScreen';
import LoginScreen from './pages/login/LoginScreen';
import Signup00Screen from './pages/login/Signup00Screen';
import Signup01Screen from './pages/login/Signup01Screen';
import FirstSettingStep01Screen from './pages/firstSetting/FirstSettingStep01Screen';
import FirstSettingStep02Screen from './pages/firstSetting/FirstSettingStep02Screen';
import HomeScreen from './pages/HomeScreen';
import MyLibrarySettingScreen from './pages/setting/MyLibrarySettingScreen';

// Context
import LoginContextProvider, { LoginContext } from './contexts/LoginContextProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

//  네비게이션 판단담당하는 컴포넌트
const AppNavigator = () => {
    const { isLoading, isLogin, userInfo } = useContext(LoginContext);

    useEffect(() => {
        if (isLoading) return;

        // 로그인 X → 로그인 화면
        if (!isLogin) {
            console.log("🌀 로그인 필요 → LoginScreen");
            reset("LoginScreen");
            return;
        }

        // 로그인 O → 설정 여부 확인
        if (userInfo) {
            const { gender, birthYear } = userInfo;
            const isIncomplete = !gender || gender === "" || birthYear == null;

            if (isIncomplete) {
                console.log("🔀 설정 필요 → FirstSettingStep01Screen");
                reset("FirstSettingStep01Screen");
            } else {
                console.log("✅ 설정 완료 → HomeScreen");
                reset("HomeScreen");
            }
        }
    }, [isLoading, isLogin, userInfo]);

    // 초기에는 아무것도 보여주지 않음 (Splash 역할)
    return null;
};

const App = () => {
    return (
        <NavigationContainer ref={navigationRef}> {/*  RootNavigation 연결 */}
            <SafeAreaProvider>
                <LoginContextProvider>
                    <AppNavigator /> {/* ✅ 상태 기반 네비게이션 분기 */}
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />

                        <Stack.Screen name="Signup00Screen" component={Signup00Screen} />
                        <Stack.Screen name="Signup01Screen" component={Signup01Screen} />
                        <Stack.Screen name="FirstSettingStep01Screen" component={FirstSettingStep01Screen} />
                        <Stack.Screen name="FirstSettingStep02Screen" component={FirstSettingStep02Screen} />

                        <Stack.Screen name="HomeScreen" component={HomeScreen} />
                        <Stack.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen} />


                    </Stack.Navigator>
                </LoginContextProvider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
};

export default App;
