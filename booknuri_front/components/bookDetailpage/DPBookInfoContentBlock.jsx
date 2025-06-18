import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import SectionHeader from '../public/publicHeader/SectionHeader';

const { width: fixwidth } = Dimensions.get('window');

const decodeHTML = (str) => {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const DPBookInfoContentBlock = ({ description }) => {
  if (!description) return null;

  const decodedDescription = decodeHTML(description); // 👈 치환된 문자열로 변경

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <SectionHeader label="책 소개" />
      <Text style={styles.description}>{decodedDescription}</Text>
      <View style={styles.divider} />
    </View>
  );
};

export default DPBookInfoContentBlock;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    borderRadius: fixwidth * 0.03,
    marginVertical: fixwidth * 0.07,
  },
  description: {
    backgroundColor: '#fffaf1',
    borderRadius: fixwidth * 0.03,
    paddingHorizontal: fixwidth * 0.03,
    paddingVertical: fixwidth * 0.055,
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Light',
    color: '#333',
    lineHeight: fixwidth * 0.067,
  },
});
