import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width: fixwidth } = Dimensions.get('window');

const HomeHeader = ({ title = '제목' }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: fixwidth * 0.025,
    paddingHorizontal: fixwidth * 0.07,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: fixwidth * 0.101,
    width: '100%',
    marginBottom: fixwidth * 0.0037,
  },
  title: {
    fontSize: fixwidth * 0.0447,
    color: '#111',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.05,
    textAlign: 'center',
  },
});

export default HomeHeader;
