import api from './api';

/**
 * 🔍 도서 검색 API
 * 특정 도서관(libCode)에서 키워드로 도서를 검색함
 * @param {string} libCode - 도서관 코드
 * @param {string} keyword - 검색 키워드
 * @param {string} sort - 정렬 기준 ('score' | 'like' | 'review' | 'new')
 * @returns {Promise<List<LibraryBookSearchDocument>>}
 */
export const searchBooks = ({ libCode, keyword, sort = 'score' }) => {
  return api.get('/library-book-search', {
    params: { libCode, keyword, sort },
  });
};

/**
 * ✨ 자동완성 API
 * 입력한 키워드 prefix로 도서 제목 자동완성 (인기순 정렬)
 * @param {string} libCode - 도서관 코드
 * @param {string} keyword - 검색어 접두사 (1자 이상)
 * @returns {Promise<List<LibraryBookSearchDocument>>}
 */
export const searchAutocomplete = ({ libCode, keyword }) => {
  return api.get('/library-book-search/autocomplete', {
    params: { libCode, keyword },
  });
};
