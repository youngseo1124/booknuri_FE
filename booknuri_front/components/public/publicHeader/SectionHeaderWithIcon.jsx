import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const SectionHeaderWithIcon = ({ label }) => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faChevronRight} size={fixwidth * 0.0437} color="#333" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default SectionHeaderWithIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: fixwidth * 0.045,
    fontFamily: 'NotoSansKR-SemiBold',
    marginLeft: fixwidth * 0.0057,
    color: '#333',
    lineHeight: fixwidth * 0.057,
    paddingBottom: fixwidth * 0.007,
  },
});
