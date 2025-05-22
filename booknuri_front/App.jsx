/*
*
* <앱 처음 실행시>
 storage에서 islogin true인지+ 그리고 jwt 유효한지 검증->둘다 통과하면 /home으로
 통과못하면 login 화면으로
*
*/

import { enableScreens } from 'react-native-screens';
enableScreens();


import React, {useContext, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// ✅ 페이지들 import
import LoadingScreen from './pages/LoadingScreen';
import LoginScreen from './pages/login/LoginScreen';
import Signup00Screen from './pages/login/Signup00Screen';

import HomeScreen from './pages/HomeScreen';

// 로그인 상태를 관리하는 Context
import LoginContextProvider, { LoginContext } from './contexts/LoginContextProvider';


import { LogBox } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Signup01Screen from './pages/login/Signup01Screen';
import MyLibrarySettingScreen from './pages/setting/MyLibrarySettingScreen';



// Stack Navigator 생성
const Stack = createStackNavigator();

const AppNavigator = () => {
  const loginContext = useContext(LoginContext);
  const { isLoading, isLogin } = loginContext;
  const navigation = useNavigation();

  // 로딩 중, 로그인 상태에 따라 화면을 조건부로 설정
  if (isLoading) {
    return <LoadingScreen/>;


  }
  // 콘솔 로그로 상태 확인
  console.log("isLoading(로딩여부):", isLoading);
  console.log("isLogin(로그인여부):", isLogin);

  // useEffect로 네비게이션 리셋
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isLoading) {
      console.log("Resetting navigation to:", isLogin ? 'HomeScreen' : 'LoginScreen');
      navigation.reset({
        index: 0,
        routes: [{ name: isLogin ? 'HomeScreen' : 'LoginScreen' }],
      });
    }

  }, [isLoading, isLogin, navigation]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Signup00Screen" component={Signup00Screen} />
      <Stack.Screen name="Signup01Screen" component={Signup01Screen} />
      <Stack.Screen name="MyLibrarySettingScreen" component={MyLibrarySettingScreen}/>




    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <LoginContextProvider>
          <AppNavigator />
        </LoginContextProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
