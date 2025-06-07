import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Easing,
} from 'react-native';
import { getPersonalRecommendations } from '../../apis/apiFunction_recommend';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import SectionHeaderWithIcon from '../public/publicHeader/SectionHeaderWithIcon';
import VerticalGap from '../public/publicUtil/VerticalGap';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const backgroundColors = [
  '#ffdd99', '#cfc0ec', '#add3f3', '#bde5be', '#a5f1d1', '#f5b3ca', '#adebf3',
];

const PrivateRecommendBannerCarousel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [containerWidth, setContainerWidth] = useState(fixwidth);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPersonalRecommendations();
        if (res.data?.length > 0) {
          const original = res.data;
          const extended = [
            original[original.length - 1],
            ...original,
            original[0],
          ];
          setRecommendations(extended);

          setTimeout(() => {
            scrollRef.current?.scrollTo({ x: containerWidth, animated: false });
            setCurrentPage(1);
            animatedValue.setValue(containerWidth);
          }, 0);
        }
      } catch (err) {
        console.error('🔥 개인 맞춤 추천 실패:', err);
      }
    };
    fetchData();
  }, [containerWidth]);

  useEffect(() => {
    if (isAutoPlay && recommendations.length > 1) {
      intervalRef.current = setInterval(() => {
        const nextPage = currentPage + 1;
        const targetX = containerWidth * nextPage;

        Animated.timing(animatedValue, {
          toValue: targetX,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          scrollRef.current?.scrollTo({ x: targetX, animated: false });

          if (nextPage === recommendations.length - 1) {
            scrollRef.current?.scrollTo({ x: containerWidth, animated: false });
            animatedValue.setValue(containerWidth);
            setCurrentPage(1);
          } else {
            setCurrentPage(nextPage);
          }
        });
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, currentPage, containerWidth, recommendations]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      scrollRef.current?.scrollTo({ x: value, animated: false });
    });
    return () => animatedValue.removeListener(listener);
  }, []);

  const handleMomentumEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newPage = Math.round(offsetX / containerWidth);

    if (newPage === 0) {
      scrollRef.current?.scrollTo({
        x: containerWidth * (recommendations.length - 2),
        animated: false,
      });
      animatedValue.setValue(containerWidth * (recommendations.length - 2));
      setCurrentPage(recommendations.length - 2);
    } else if (newPage === recommendations.length - 1) {
      scrollRef.current?.scrollTo({ x: containerWidth, animated: false });
      animatedValue.setValue(containerWidth);
      setCurrentPage(1);
    } else {
      animatedValue.setValue(containerWidth * newPage);
      setCurrentPage(newPage);
    }
  };

  if (recommendations.length <= 2) return null;

  const realCount = recommendations.length - 2;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <VerticalGap height={fixwidth * 0.0147} />
      <SectionHeaderWithIcon label="맞춤 추천" />
      <VerticalGap height={fixwidth * 0.0207} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEnabled={true}
      >
        {recommendations.map((item, index) => {
          const bgColor = backgroundColors[index % backgroundColors.length];
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, { width: containerWidth, backgroundColor: bgColor }]}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('BookDetailScreen', {
                  isbn: item.isbn13,
                })
              }
            >
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.bookname}</Text>
                <Text style={styles.author} numberOfLines={1}>{item.authors}</Text>
              </View>
              <Image
                source={{ uri: item.bookImageURL }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.absoluteController}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsAutoPlay((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={isAutoPlay ? faPause : faPlay}
            size={fixwidth * 0.035}
            color="#333"
          />
        </TouchableOpacity>

        <Text style={styles.pageText}>
          {((currentPage - 1 + realCount) % realCount) + 1} / {realCount}
        </Text>
      </View>
    </View>
  );
};

export default PrivateRecommendBannerCarousel;

const styles = StyleSheet.create({
  container: {
    width: '94%',
    position: 'relative',
  },
  card: {
    height: fixwidth * 0.447,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.05,
    paddingVertical: fixwidth * 0.037,
    paddingBottom: fixwidth * 0.05,
    borderRadius: fixwidth * 0.01,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    marginRight: fixwidth * 0.04,
  },
  title: {
    fontSize: fixwidth * 0.047,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-Medium',
    marginBottom: fixwidth * 0.017,
    color: 'rgba(0,0,0,0.77)',
  },
  author: {
    fontFamily: 'NotoSansKR-Regular',
    fontSize: fixwidth * 0.033,
    color: 'rgba(0,0,0,0.47)',
  },
  image: {
    width: fixwidth * 0.227,
    height: fixwidth * 0.317,
    borderRadius: fixwidth * 0.005,
  },
  absoluteController: {
    position: 'absolute',
    bottom: fixwidth * 0.01,
    right: fixwidth * 0.0277,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageText: {
    fontSize: fixwidth * 0.0307,
    color: 'rgba(0,0,0,0.67)',
    paddingHorizontal: fixwidth * 0.024,
    marginRight: fixwidth * 0.027,
    borderRadius: fixwidth * 0.0177,
    backgroundColor: 'rgba(255,255,255,0.47)',
  },
  controlBtn: {
    paddingVertical: fixwidth * 0.0037,
    paddingHorizontal: fixwidth * 0.015,
    marginHorizontal: fixwidth * 0.027,
    borderRadius: fixwidth * 0.0177,
    backgroundColor: 'rgba(255,255,255,0.47)',
  },
});
