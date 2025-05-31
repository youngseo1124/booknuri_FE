
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const { width: fixwidth } = Dimensions.get('window');

const StarRatingBox = ({
                         value = 0,
                         onChange,
                         starSize = fixwidth * 0.09, // ⭐ 별 크기 조절 가능 (디폴트: 현재값)
                       }) => {
  const [rating, setRating] = useState(value);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleStarPress = (val) => {
    setRating(val);
    onChange && onChange(val);
  };

  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((v) => (
        <TouchableOpacity
          key={v}
          onPress={() => handleStarPress(v * 2)}
          activeOpacity={0.7}
        >
          <FontAwesomeIcon
            icon={faStar}
            size={starSize} // ✅ props로 받은 값 사용
            color={rating >= v * 2 ? '#FFBC00' : '#ccc'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRatingBox;

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: fixwidth * 0.025,
    marginBottom: fixwidth * 0.00,
  },
});
