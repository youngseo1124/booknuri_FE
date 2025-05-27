import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';


const { width: fixwidth } = Dimensions.get('window');

const BookInfoContentBlock = ({ description }) => {
  if (!description) return null;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      <View style={styles.textWrapper}>
        <View style={styles.labelWrapper}>
          <FontAwesomeIcon icon={faBookOpen} size={fixwidth * 0.057} />
          <Text style={styles.label}>책 소개</Text>
        </View>
        <Text style={styles.description}>   {description}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

export default BookInfoContentBlock;

const styles = StyleSheet.create({
  container: {
    width: '92%',
    borderRadius: fixwidth * 0.03,
    marginTop: fixwidth * 0.01,
  },


  textWrapper: {
    width: '100%',
    paddingVertical: fixwidth * 0.077,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: fixwidth * 0.037,
    gap: fixwidth * 0.025,
    paddingHorizontal: fixwidth * 0.015,
  },
  label: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-SemiBold',
    lineHeight:fixwidth * 0.05,
  },
  description: {
    backgroundColor: '#f8f4ef',
    borderRadius: fixwidth * 0.03,
    paddingHorizontal:fixwidth * 0.03,
    paddingVertical:fixwidth * 0.055,
    fontSize: fixwidth * 0.037,
    fontFamily: 'NotoSansKR-Light',
    color: '#333',
    lineHeight: fixwidth * 0.067,
  },
});
