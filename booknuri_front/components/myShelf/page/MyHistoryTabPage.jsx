import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyHistoryTabPage = ({ parentWidth }) => {
  const styles = getStyles(parentWidth);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📘 내 기록 페이지</Text>
    </View>
  );
};

export default MyHistoryTabPage;

const getStyles = (width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      width: '100%',
    },
    text: {
      fontSize: width * 0.04,
      color: 'white',
      fontFamily: 'NotoSansKR-Regular',
    },
  });
