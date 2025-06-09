import api from './api';

/**
 * ✅ 내가 작성한 리뷰 목록 조회 (책 기준 그룹화)
 * 책 1권당 하나의 리뷰만 존재하며, 최신순으로 정렬됨
 *
 * @param {number} offset - 페이지 시작 위치 (기본 0)
 * @param {number} limit - 한 페이지에 가져올 개수 (기본 10)
 * @returns {Promise<MyReviewGroupedPageResponseDto>}
 */
export const getMyGroupedReviews = async (offset = 0, limit = 10) => {
  const res = await api.get(`/book/review/my/grouped`, {
    params: { offset, limit },
  });
  return res.data;
};

/**
 * ✅ 내가 작성한 독후감 목록 조회 (책 기준 그룹화)
 * 책 1권당 하나의 독후감만 존재하며, 최신 작성순 정렬됨
 *
 * @param {number} offset - 페이지 시작 위치
 * @param {number} limit - 페이지당 개수
 * @returns {Promise<MyReflectionGroupedPageResponseDto>}
 */
export const getMyGroupedReflections = async (offset = 0, limit = 10) => {
  const res = await api.get(`/book/reflection/my/grouped`, {
    params: { offset, limit },
  });
  return res.data;
};

/**
 * ✅ 내가 작성한 인용 목록 조회 (책 기준 그룹화)
 * 한 책에 여러 인용 존재 가능하며, 최신 인용 작성일 기준 정렬됨
 *
 * @param {number} offset - 페이지 시작 위치
 * @param {number} limit - 한 번에 불러올 책 개수
 * @returns {Promise<MyQuoteGroupedPageResponseDto>}
 */
export const getMyGroupedQuotes = async (offset = 0, limit = 10) => {
  const res = await api.get(`/book/quote/my/grouped`, {
    params: { offset, limit },
  });
  return res.data;
};

/**
 * ✅ 책장에 책 추가 (기본 상태: WANT_TO_READ)
 *
 * @param {string} isbn13 - 추가할 책의 ISBN13
 * @returns {Promise<string>} - 성공 메시지 또는 오류 메시지
 */
export const addBookToShelf = async (isbn13) => {
  const res = await api.post(`/shelf-book/add`, { isbn13 });
  return res.data;
};

/**
 * ✅ 책장의 책 상태 변경 (WANT_TO_READ, READING, FINISHED 중 하나)
 *
 * @param {string} isbn13 - 대상 책 ISBN13
 * @param {'WANT_TO_READ' | 'READING' | 'FINISHED'} status - 변경할 상태값
 * @returns {Promise<string>} - 성공 메시지
 */
export const updateBookStatus = async (isbn13, status) => {
  const res = await api.put(`/shelf-book/status/${isbn13}`, null, {
    params: { status },
  });
  return res.data;
};

/**
 * ✅ 책장의 인생책 토글 (true <-> false 전환)
 *
 * @param {string} isbn13 - 인생책으로 토글할 책 ISBN13
 * @returns {Promise<string>} - 성공 메시지
 */
export const toggleLifeBook = async (isbn13) => {
  const res = await api.put(`/shelf-book/life-book/${isbn13}`);
  return res.data;
};

/**
 * ✅ 내 책장 책 목록 조회 (최신순, 상태 필터 가능)
 *
 * @param {number} page - 페이지 번호 (기본 0)
 * @param {number} size - 페이지당 항목 수 (기본 10)
 * @param {'WANT_TO_READ' | 'READING' | 'FINISHED'} [status] - 상태 필터 (없으면 전체 조회)
 * @returns {Promise<Page<MyShelfBookWithExtrasResponseDto>>}
 */
export const getMyShelfBooks = async (page = 0, size = 10, status) => {
  const params = { page, size };
  if (status) params.status = status;
  const res = await api.get(`/shelf-book/my`, { params });
  return res.data;
};
