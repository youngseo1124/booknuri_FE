import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const ReviewEditFormBlock = ({
                               placeholder,
                               maxLength = 50,
                               inputHeight = fixwidth * 0.7,
                               initialRating = 0,
                               initialText = '',
                               onRatingChange,
                               onTextChange,
                             }) => {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);

  // ⭐ 초기값 반영
  useEffect(() => {
    setRating(initialRating);
    setText(initialText);
  }, [initialRating, initialText]);

  const handleStarPress = (value) => {
    setRating(value);
    onRatingChange?.(value);
  };

  const handleTextChange = (value) => {
    setText(value);
    onTextChange?.(value);
  };

  return (
    <View style={styles.container}>
      {/* ⭐ 별점 선택 */}
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => handleStarPress(v * 2)}
            activeOpacity={0.7}
          >
            <FontAwesomeIcon
              icon={faStar}
              size={fixwidth * 0.1}
              color={rating >= v * 2 ? '#FFBC00' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>별점을 선택하세요.</Text>

      {/* ✍ 입력창 + 글자수 표시 */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.inputBox, { height: inputHeight }]}
          placeholder={placeholder}
          maxLength={maxLength}
          value={text}
          onChangeText={handleTextChange}
          multiline
        />
        <Text style={styles.countText}>{text.length}/{maxLength}</Text>
      </View>
    </View>
  );
};

export default ReviewEditFormBlock;

const styles = StyleSheet.create({
  container: {
    marginTop: fixwidth * 0.01,
    gap: fixwidth * 0.025,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: fixwidth * 0.025,
  },
  ratingText: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.34)',
    fontSize: fixwidth * 0.035,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  inputBox: {
    width: '100%',
    padding: fixwidth * 0.04,
    paddingBottom: fixwidth * 0.09,
    backgroundColor: '#ffffff',
    borderRadius: fixwidth * 0.02,
    textAlignVertical: 'top',
    fontSize: fixwidth * 0.038,
    borderWidth: fixwidth * 0.0047,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  countText: {
    position: 'absolute',
    bottom: fixwidth * 0.025,
    right: fixwidth * 0.03,
    color: '#999',
    fontSize: fixwidth * 0.03,
  },
});
