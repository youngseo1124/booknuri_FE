// navigation/HomeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pages/home/HomeScreen';
import BookSearchResultScreen from '../pages/home/BookSearchResultScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
      }}
    >

    <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BookSearchResultScreen" component={BookSearchResultScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
