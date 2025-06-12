
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const SettingItem = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}
    activeOpacity={0.6}>
      <Text style={styles.label}>{label}</Text>
      <FontAwesomeIcon icon={faChevronRight} size={fixwidth * 0.037} color='rgba(0,0,0,0.77)' />
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: fixwidth * 0.05,
    paddingHorizontal: fixwidth * 0.045,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    /*borderBottomWidth: fixwidth * 0.0017,*/
    borderColor: '#eee',
  },
  label: {
    fontSize: fixwidth * 0.038,
    color: '#111',
    fontFamily: 'NotoSansKR-Regular',
    lineHeight: fixwidth * 0.055,
  },
});
