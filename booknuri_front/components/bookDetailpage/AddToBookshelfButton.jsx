import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons'; //


const { width: fixwidth } = Dimensions.get('window');

const AddToBookshelfButton = ({ onPress, isInShelf }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isInShelf && styles.disabledButton
      ]}
      onPress={!isInShelf ? onPress : null}
      activeOpacity={isInShelf ? 1 : 0.8}
    >
      <FontAwesomeIcon
        icon={faBookmark}
        size={fixwidth * 0.04}
        color={isInShelf ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.25)'}
      />
      <Text style={[styles.text, isInShelf && styles.disabledText]}>
        {isInShelf ? '  내 책장에 담긴 책' : '  내 책장에 담기'}
      </Text>
    </TouchableOpacity>
  );
};

export default AddToBookshelfButton;

const styles = StyleSheet.create({
  button: {
    marginTop: fixwidth * 0.02,
    paddingHorizontal: fixwidth * 0.027,
    paddingVertical: fixwidth * 0.01,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: fixwidth * 0.0055,
    borderRadius: fixwidth * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  text: {
    fontSize: fixwidth * 0.034,
    color: 'rgba(0,0,0,0.38)',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.06
  },
  disabledButton: {
    borderColor: 'rgba(0,0,0,0.08)',
  },
  disabledText: {
    color: 'rgba(0,0,0,0.38)',
  },

})
