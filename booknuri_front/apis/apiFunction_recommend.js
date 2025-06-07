import api from './api';

/**
 * 📌 베스트셀러 추천 API
 * 대표 도서관 기준으로 기간별 인기 도서를 추천함
 * @param {string} period - 'weekly' | 'monthly' | 'yearly'
 * @param {number} [mainCategoryId] - (선택) 메인 카테고리 ID
 * @returns {Promise<RecommendBookDto[]>}
 */
export const getBestsellerBooks = ({ period, mainCategoryId }) => {
  return api.get('/recommend/bestseller', {
    params: {
      period,
      ...(mainCategoryId && { mainCategoryId }), // mainCategoryId 있을 때만 추가
    },
  });
};

/**
 * 👤 개인 맞춤 추천 API
 * 최근 본 책 기반 추천 (내 도서관에 실제로 있는 책만)
 * @returns {Promise<RecommendBookDto[]>}
 */
export const getPersonalRecommendations = () => {
  return api.get('/recommend/personal');
};

/**
 * 📊 성별+연령대 베스트셀러 추천 API
 * @param {string} gender - 'M' | 'F'
 * @param {number} birthYearGroup - 10, 20, 30, ...
 * @returns {Promise<RecommendBookDto[]>}
 */
export const getDemographicRecommendations = ({ gender, birthYearGroup }) => {
  return api.get('/recommend/bestseller/demographic', {
    params: { gender, birthYearGroup },
  });
};

/**
 * 🗂 메인 카테고리 리스트 API
 * 추천 도서 필터링용으로 사용할 수 있는 메인 카테고리 리스트를 반환함
 * @returns {Promise<{ id: number, name: string }[]>}
 */
export const getMainCategoryList = () => {
  return api.get('/recommend/categories');
};

