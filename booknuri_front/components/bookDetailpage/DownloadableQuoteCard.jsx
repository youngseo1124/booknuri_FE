// DownloadableQuoteCard.jsx (수정)
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const DownloadableQuoteCard = ({ quoteId }) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('QuoteCaptureScreen', { quoteId });
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>이미지로 저장하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DownloadableQuoteCard;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    width: '99%',


    borderRadius: fixwidth*0.01,
    borderColor: 'rgba(0,0,0,0.23)',
    borderWidth: fixwidth*0.0017,
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.54)',
    fontSize: fixwidth * 0.03,
    fontFamily: 'NotoSansKR-Light',
  },
});
