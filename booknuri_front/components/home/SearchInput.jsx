import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, Keyboard, ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchAutocomplete } from '../../apis/apiFunction_search';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import BookSuggestionCarousel from './BookSuggestionCarousel';
import { useNavigation } from '@react-navigation/native';

const { width: fixwidth } = Dimensions.get('window');

const SearchInput = ({ libCode, onFocusChange }) => {
  const navigation = useNavigation();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem('recent_keywords').then(data => {
      if (data) setRecentKeywords(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    if (!searchKeyword.trim()) {
      setRelatedKeywords([]);
      return;
    }

    searchAutocomplete({ libCode, keyword: searchKeyword })
      .then(res => setRelatedKeywords(res.data))
      .catch(() => setRelatedKeywords([]));
  }, [searchKeyword]);

  const handleSearchSubmit = (keyword) => {
    if (!keyword.trim()) return;

    const newList = [keyword, ...recentKeywords.filter(k => k !== keyword)].slice(0, 10);
    setRecentKeywords(newList);
    AsyncStorage.setItem('recent_keywords', JSON.stringify(newList));

    setIsFocused(false);
    onFocusChange?.(false);
    Keyboard.dismiss();

    navigation.navigate('BookSearchResultScreen', { libCode, keyword });
  };

  const handleKeywordDelete = (word) => {
    const filtered = recentKeywords.filter(k => k !== word);
    setRecentKeywords(filtered);
    AsyncStorage.setItem('recent_keywords', JSON.stringify(filtered));
  };

  const handleAllDelete = () => {
    setRecentKeywords([]);
    AsyncStorage.removeItem('recent_keywords');
  };

  const handleBlurDismiss = () => {
    setIsFocused(false);
    onFocusChange?.(false);
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  return (
    <TouchableWithoutFeedback onPress={handleBlurDismiss}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          {isFocused && (
            <TouchableOpacity onPress={handleBlurDismiss}>
              <FontAwesomeIcon icon={faChevronLeft} size={fixwidth * 0.05} color="#111" />
            </TouchableOpacity>
          )}
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="검색어를 입력해 주세요."
            placeholderTextColor="#aaa"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            onFocus={handleFocus}
            onSubmitEditing={() => handleSearchSubmit(searchKeyword)}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => handleSearchSubmit(searchKeyword)}>
            <FontAwesomeIcon icon={faSearch} size={fixwidth * 0.05} color="#888" />
          </TouchableOpacity>
        </View>

        {isFocused && (
          <View style={styles.keywordBox}>
            {searchKeyword.trim() === '' ? (
              <>
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionTitle}>최근 검색어</Text>
                  <TouchableOpacity onPress={handleAllDelete}>
                    <Text style={styles.clearAll}>전체삭제</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: 'center' }}
                >
                  <View style={styles.keywordRow}>
                    {recentKeywords.slice(0, 10).map((word) => (
                      <TouchableOpacity
                        key={word}
                        onPress={() => {
                          setSearchKeyword(word);
                          inputRef.current?.focus();
                        }}
                      >
                        <View style={styles.keywordChip}>
                          <Text style={styles.keywordText}>{word}</Text>
                          <TouchableOpacity onPress={() => handleKeywordDelete(word)}>
                            <Text style={styles.deleteX}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </>
            ) : (
              <BookSuggestionCarousel
                books={relatedKeywords}
                onItemPress={handleSearchSubmit}
              />
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: "#ffffff",
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.037,
    backgroundColor: '#ffffff',
    borderRadius: fixwidth * 0.033,
    marginHorizontal: fixwidth * 0.033,
    borderWidth: fixwidth * 0.0011,
    borderColor: 'rgba(0,0,0,0.38)',
  },
  input: {
    flex: 1,
    fontSize: fixwidth * 0.04,
    height: fixwidth * 0.107,
    marginHorizontal: fixwidth * 0.02,
    paddingVertical: fixwidth * 0.025,
    textAlignVertical: 'center',
  },
  keywordBox: {
    marginTop: fixwidth * 0.017,
    paddingHorizontal: fixwidth * 0.045,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: fixwidth * 0.02,
  },
  sectionTitle: {
    fontSize: fixwidth * 0.04,
    fontFamily: 'NotoSansKR-Medium',
    lineHeight: fixwidth * 0.087,
  },
  clearAll: {
    color: '#999',
    fontFamily: 'NotoSansKR-Regular',
    fontSize: fixwidth * 0.035,
  },
  keywordRow: {
    flexDirection: 'row',
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fixwidth * 0.04,
    paddingVertical: fixwidth * 0.017,
    backgroundColor: '#ffffff',
    borderRadius: fixwidth * 0.05,
    marginRight: fixwidth * 0.037,
    height: fixwidth * 0.09,
    borderColor: 'rgba(0,0,0,0.34)',
    borderWidth: fixwidth * 0.001,
  },
  keywordText: {
    fontSize: fixwidth * 0.0357,
    color: '#111',
    marginRight: fixwidth * 0.037,
  },
  deleteX: {
    fontSize: fixwidth * 0.0397,
    color: '#888',
  },
});
