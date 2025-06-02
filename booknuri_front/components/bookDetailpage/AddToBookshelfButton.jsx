import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons'; //


const { width: fixwidth } = Dimensions.get('window');

const AddToBookshelfButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={1}>
      <FontAwesomeIcon icon={faBookmark} size={fixwidth * 0.04} color='rgba(0,0,0,0.55)'/>
      <Text style={styles.text}>  내 책장에 담기</Text>
    </TouchableOpacity>
  );
};

export default AddToBookshelfButton;

const styles = StyleSheet.create({
  button: {
    marginTop: fixwidth * 0.02,
    paddingHorizontal: fixwidth * 0.02,
    paddingVertical: fixwidth * 0.01,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: fixwidth*0.0055,
    borderRadius: fixwidth * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:fixwidth*0.33,
    backgroundColor: 'rgba(0,0,0,0)',


  },
  text: {
    fontSize: fixwidth * 0.034,
    color: 'rgba(0,0,0,0.62)',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.06
  },
})
