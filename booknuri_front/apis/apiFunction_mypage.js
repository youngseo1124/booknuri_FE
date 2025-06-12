import api from './api';

/**
 * 🕓 최근 본 책 목록 조회 API
 * 로그인한 사용자의 최근 본 책 30권을 최신순으로 조회함
 * @returns {Promise<BookSimpleInfoDto[]>} - 최근 본 책 정보 리스트
 *
 * BookSimpleInfoDto 구조:
 * {
 *   isbn13: string,
 *   bookTitle: string,
 *   bookAuthor: string,
 *   bookImageUrl: string
 * }
 */
export const getRecentViewedBooks = () => {
  return api.get('/log/recent-books');
};
