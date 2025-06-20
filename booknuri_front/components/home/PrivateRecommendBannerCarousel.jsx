import React, { useEffect, useLayoutEffect, useRef, useState, useContext } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import VerticalGap from '../public/publicUtil/VerticalGap';
import { useNavigation } from '@react-navigation/native';
import { BannerPageContext } from '../../contexts/BannerPageContext';

const { width: fixwidth } = Dimensions.get('window');

const backgroundColors = [
  '#ffdd99', '#cfc0ec', '#add3f3', '#bde5be', '#a5f1d1', '#f5b3ca', '#adebf3',
];

const PrivateRecommendBannerCarousel = ({ bookList = [], onReady }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [containerWidth, setContainerWidth] = useState(fixwidth);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [scrollReady, setScrollReady] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const { currentBannerPage, setCurrentBannerPage } = useContext(BannerPageContext);
  const [currentPage, _setCurrentPage] = useState(currentBannerPage);
  const updatePage = (page) => {
    _setCurrentPage(page);
    setCurrentBannerPage(page);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  const navigation = useNavigation();



  useEffect(() => {
    if (bookList.length > 0) {
      const extended = [bookList[bookList.length - 1], ...bookList, bookList[0]];
      setRecommendations(extended);
    }
  }, [bookList]);

  useLayoutEffect(() => {
    if (recommendations.length > 0 && containerWidth > 0) {
      const startX = containerWidth * currentBannerPage;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ x: startX, animated: false });
          animatedValue.setValue(startX);
          _setCurrentPage(currentBannerPage);
          setScrollReady(true);
          setScrollVisible(true);
          onReady?.();
          setTimeout(() => {
            setImageVisible(true);
            setScrollEnabled(true);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 170,
              useNativeDriver: true,
            }).start();
          }, 14);
        });
      });
    }
  }, [recommendations, containerWidth]);

  useEffect(() => {
    if (isAutoPlay && recommendations.length > 1 && scrollReady) {
      intervalRef.current = setInterval(() => {
        const nextPage = currentPage + 1;
        const targetX = containerWidth * nextPage;

        Animated.timing(animatedValue, {
          toValue: targetX,
          duration: 777,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          if (nextPage === recommendations.length - 1) {
            scrollRef.current?.scrollTo({ x: containerWidth, animated: false });
            animatedValue.setValue(containerWidth);
            updatePage(1);
          } else {
            scrollRef.current?.scrollTo({ x: targetX, animated: false });
            animatedValue.setValue(targetX);
            updatePage(nextPage);
          }
        });
      }, 2777);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, currentPage, containerWidth, recommendations, scrollReady]);

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
      const lastX = containerWidth * (recommendations.length - 2);
      scrollRef.current?.scrollTo({ x: lastX, animated: false });
      animatedValue.setValue(lastX);
      updatePage(recommendations.length - 2);
    } else if (newPage === recommendations.length - 1) {
      scrollRef.current?.scrollTo({ x: containerWidth, animated: false });
      animatedValue.setValue(containerWidth);
      updatePage(1);
    } else {
      animatedValue.setValue(containerWidth * newPage);
      updatePage(newPage);
    }
  };

  const formatTitleLines = (title) => {
    if (!title) return ['', '', null];

    const trimmed = title.trim();
    const breakIndex = Math.min(
      ...[':', '='].map((s) => trimmed.indexOf(s)).filter((i) => i !== -1)
    );

    if (breakIndex !== Infinity) {
      const first = trimmed.slice(0, breakIndex).trim();
      const second = trimmed.slice(breakIndex).trim().replace(/^[:=]/, ':');
      return [first, second, 'symbol'];
    }

    if (trimmed.length > 16) {
      return [trimmed.slice(0, 16), trimmed.slice(16), 'length'];
    }

    return [trimmed, '', null];
  };

  if (!scrollReady || recommendations.length <= 2 || containerWidth === 0) {
    return <View style={{ height: fixwidth * 0.447 }} />;
  }

  const realCount = recommendations.length - 2;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <VerticalGap height={fixwidth * 0.0207} />
      <View style={{ opacity: scrollVisible ? 1 : 0 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEnabled={scrollEnabled}
        >
          <Animated.View style={{ flexDirection: 'row', opacity: fadeAnim }}>
            {recommendations.map((item, index) => {
              const isFake = index === 0 || index === recommendations.length - 1;
              const data = isFake ? recommendations[1] : item;
              const realIndex = Math.max(index - 1, 0);
              const bgColor = backgroundColors[realIndex % backgroundColors.length];

              const [line1, line2, reason] = formatTitleLines(data.bookname);

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.card, { width: containerWidth, backgroundColor: bgColor }]}
                  activeOpacity={0.9}
                  onPress={() => {
                    if (!isFake) {
                      navigation.navigate('BookDetailScreen', {
                        isbn: data.isbn13,
                      });
                    }
                  }}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                      {line1}
                    </Text>
                    {line2 !== '' && (
                      <Text
                        style={reason === 'symbol' ? styles.titleSub : styles.title}
                        numberOfLines={1}
                      >
                        {line2}
                      </Text>
                    )}
                    <Text style={styles.author} numberOfLines={1}>
                      {data.authors}
                    </Text>
                  </View>
                  {imageVisible && (
                    <Image
                      key={data.bookImageURL}
                      source={{ uri: data.bookImageURL }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>

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
    fontSize: fixwidth * 0.0497,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.06,
    marginBottom: fixwidth * 0.007,
    color: 'rgba(0,0,0,0.77)',
  },
  titleSub: {
    fontSize: fixwidth * 0.0377,
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.053,
    color: 'rgba(0,0,0,0.74)',
    marginBottom: fixwidth * 0.007,
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
