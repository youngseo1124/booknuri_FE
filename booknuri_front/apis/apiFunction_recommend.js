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


/**
 * 📌 카테고리 기반 베스트셀러 추천 API
 * 사용자의 대표 도서관 기준으로, 하위 → 중간 → 메인 카테고리 순서로 인기 책을 필터링하여 추천함
 * (도서관에 실제로 있는 책만 반환되며, 최대 7권)
 *
 * @param {object} params
 * @param {string} params.mainCategoryName - ✅ 필수: 메인 카테고리 이름 (예: "문학", "철학")
 * @param {string} [params.middleCategoryName] - ❌ 선택: 중간 카테고리 이름 (예: "심리학")
 * @param {string} [params.subCategoryName] - ❌ 선택: 서브 카테고리 이름 (예: "응용 심리학 일반")
 * @returns {Promise<RecommendBookDto[]>}
 */
export const getCategoryBasedRecommendations = ({
                                                  mainCategoryName,
                                                  middleCategoryName,
                                                  subCategoryName,
                                                }) => {
  return api.get('/recommend/bestseller/category', {
    params: {
      mainCategoryName,
      ...(middleCategoryName && { middleCategoryName }),
      ...(subCategoryName && { subCategoryName }),
    },
  });
};




/**
 * 🔗 연관 도서 추천 API (ISBN 기준)
 * 특정 도서를 본 유저들의 열람 패턴을 분석해 유사한 도서를 추천함
 * A책 기준으로 최대 10권, 도서관에 실제 존재하는 책만 반환됨
 *
 * @param {string} isbn13 - 기준 도서의 ISBN13
 * @returns {Promise<RecommendBookDto[]>}
 */
export const getRelatedBooksByIsbn = (isbn13) => {
  return api.get('/recommend/related', {
    params: { isbn13 },
  }).then(res => res.data);
};
