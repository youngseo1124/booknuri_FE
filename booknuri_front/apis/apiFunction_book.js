import api from './api';

//  특정 ISBN의 책 상세 정보
export const getBookTotalInfo = (isbn13) => {
  return api.get(`/book/${isbn13}`);
};


//  ISBN 존재 여부 확인 (존재 여부만 true/false)
export const checkBookExists = (isbn13) => {
  return api.get(`/book/exist/${isbn13}`);
};


/**
 * ❓ 리뷰 작성 여부 확인
 * @param {string} isbn13 - 확인할 책 ISBN13
 * @returns {Promise} alreadyReviewed: true | false
 */
export const checkAlreadyReviewed = (isbn13) => {
  return api.get(`/book/review/exist/${isbn13}`);
};


/**
 * ✍️ 리뷰 작성 (유저 1명당 책 1개만 작성 가능)
 * @param {object} data - 리뷰 작성 정보
 * @param {string} data.isbn13 - 리뷰 대상 책 ISBN13
 * @param {string} data.content - 리뷰 내용
 * @param {number} data.rating - 별점 (1~10)
 * @param {boolean} data.containsSpoiler - 스포일러 포함 여부
 * @returns {Promise} 작성 후 최신 리뷰 + 책 정보 반환
 */
export const createReview = (data) => {
  return api.post('/book/review', data);
};


/**
 * ✍️ 특정 책에 대한 내가 작성한 리뷰 조회
 * @param {string} isbn13 - 책 ISBN13
 * @returns {Promise} BookReviewResponseDto
 */
export const getMyReviewByIsbn = (isbn13) => {
  return api.get(`/book/review/my/${isbn13}`);
};


/**
 * 🛠️ 리뷰 수정 (본인만 가능)
 * @param {object} data - 수정할 리뷰 정보
 * @param {number} data.reviewId - 리뷰 ID
 * @param {string} data.content - 수정할 내용
 * @param {number} data.rating - 별점
 * @param {boolean} data.containsSpoiler - 스포 포함 여부
 * @returns {Promise} 수정 성공 메시지
 */
export const updateReview = (data) => {
  return api.put('/book/review', data);
};

/**
 * ❌ 리뷰 삭제 (본인만 가능)
 * @param {number} reviewId - 삭제할 리뷰 ID
 * @returns {Promise} 삭제 성공 메시지
 */
export const deleteReview = (reviewId) => {
  return api.delete(`/book/review/${reviewId}`);
};

/**
 * 👍 리뷰 좋아요 또는 취소 (toggle 형식)
 * @param {number} reviewId - 좋아요 누를 리뷰 ID
 * @returns {Promise} liked: true(좋아요 성공) or false(좋아요 취소)
 */
export const toggleLikeReview = (reviewId) => {
  return api.post(`/book/review/like/${reviewId}`);
};

/**
 * 📚 내가 작성한 모든 리뷰 조회 (마이페이지용)
 * @param {number} offset - 페이지 오프셋 (기본값 0)
 * @param {number} limit - 페이지당 개수 (기본값 20)
 * @returns {Promise} 리뷰 목록 (책 정보도 포함)
 */
export const getMyReviews = (offset = 0, limit = 20) => {
  return api.get('/book/review/my', {
    params: { offset, limit },
  });
};

/**
 * 📖 특정 책의 모든 리뷰 조회 (정렬, 페이지네이션 포함)
 * @param {string} isbn13 - 조회할 책 ISBN13
 * @param {string} sort - 정렬 방식: new | high | low | like (기본값 new)
 * @param {number} offset - 페이지 오프셋 (기본값 0)
 * @param {number} limit - 페이지당 개수 (기본값 20)
 * @returns {Promise} 리뷰 목록 (유저 정보 포함)
 */
export const getBookReviewList = (isbn13, sort = 'new', offset = 0, limit = 20) => {
  return api.get(`/book/review/list/${isbn13}`, {
    params: { sort, offset, limit },
  });
};
