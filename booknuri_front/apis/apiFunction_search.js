import api from './api';

/**
 * 🔍 도서 검색 API
 * 특정 도서관(libCode)에서 키워드로 도서를 검색함 (페이지네이션 포함)
 * @param {string} libCode - 도서관 코드
 * @param {string} keyword - 검색 키워드
 * @param {string} keywordType - 검색 대상 필드 ('bookname' | 'authors'), 기본값: 'bookname'
 * @param {string} sort - 정렬 기준 ('score' | 'like' | 'review' | 'new' | 'old'), 기본값: 'score'
 * @param {number} offset - 시작 위치 (기본값: 0)
 * @param {number} limit - 가져올 개수 (기본값: 20)
 * @returns {Promise<{ totalCount: number, results: LibraryBookSearchDocument[] }>}
 */
export const searchBooks = ({
                              libCode,
                              keyword,
                              keywordType = 'bookname',
                              sort = 'score',
                              offset = 0,
                              limit = 20,
                            }) => {
  return api.get('/library-book-search', {
    params: { libCode, keyword, keywordType, sort, offset, limit },
  });
};

/**
 * ✨ 자동완성 API
 * 입력한 키워드 prefix로 도서 제목 자동완성 (인기순 정렬)
 * @param {string} libCode - 도서관 코드
 * @param {string} keyword - 검색어 접두사 (1자 이상)
 * @returns {Promise<LibraryBookSearchDocument[]>}
 */
export const searchAutocomplete = ({ libCode, keyword }) => {
  return api.get('/library-book-search/autocomplete', {
    params: { libCode, keyword },
  });
};
