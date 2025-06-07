import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import SectionHeader from '../public/publicHeader/SectionHeader';


const { width: fixwidth } = Dimensions.get('window');

const DPBookInfoContentBlock = ({ description }) => {
  if (!description) return null;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <SectionHeader label="책 소개" />
      <Text style={styles.description}>   {description}</Text>
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
    paddingHorizontal:fixwidth * 0.03,
    paddingVertical:fixwidth * 0.055,
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Light',
    color: '#333',
    lineHeight: fixwidth * 0.067,
  },
});
