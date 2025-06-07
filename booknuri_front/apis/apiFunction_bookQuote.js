import api from './api'; // 공통 axios 인스턴스

/**
 * ✍️ 인용 작성 (한 유저가 책 여러 번 인용 가능)
 * @param {object} data - 인용 작성 정보
 * @param {string} data.isbn13 - 책 ISBN13
 * @param {string} data.quoteText - 인용 문구
 * @param {number} data.fontScale - 글자 크기 (1~10)
 * @param {string} data.fontColor - 글자 색상
 * @param {number} data.backgroundId - 배경 ID
 * @param {boolean} data.visibleToPublic - 공개 여부
 */
export const createBookQuote = (data) => {
  return api.post('/book/quote', data);
};

/**
 * 🛠️ 인용 수정 (작성자만 가능)
 * @param {object} data - 인용 수정 정보
 * @param {number} data.quoteId - 인용 ID
 * @param {string} data.quoteText - 수정된 인용 문구
 * @param {number} data.fontScale
 * @param {string} data.fontColor
 * @param {number} data.backgroundId
 * @param {boolean} data.visibleToPublic
 */
export const updateBookQuote = (data) => {
  return api.put('/book/quote', data);
};

/**
 * 🗑️ 인용 삭제 (작성자만 가능)
 * @param {number} quoteId - 삭제할 인용 ID
 */
export const deleteBookQuote = (quoteId) => {
  return api.delete(`/book/quote/${quoteId}`);
};

/**
 * 📚 내 인용 목록 조회 (최신순, 페이지네이션)
 * @param {number} offset - 시작 인덱스 (기본값 0)
 * @param {number} limit - 개수 (기본값 10)
 */
export const getMyQuotes = (offset = 0, limit = 10) => {
  return api.get(`/book/quote/my?offset=${offset}&limit=${limit}`);
};

/**
 * 📌 내 인용 단건 조회 (수정용)
 * @param {number} quoteId - 조회할 인용 ID
 */
export const getMyQuoteById = (quoteId) => {
  return api.get(`/book/quote/my/${quoteId}`);
};

/**
 * 📖 특정 책의 인용 리스트 (공개된 인용만)
 * @param {string} isbn13 - 책 ISBN13
 * @param {number} offset - 시작 인덱스 (기본값 0)
 * @param {number} limit - 개수 (기본값 10)
 */
export const getBookQuoteListByIsbn = (isbn13, sort = 'like', offset = 0, limit = 10) => {
  return api.get(`/book/quote/list/${isbn13}`, {
    params: { sort, offset, limit },
  });
};
/**
 * ❤️ 인용 좋아요 토글 (좋아요/취소)
 * @param {number} quoteId - 인용 ID
 */
export const toggleBookQuoteLike = (quoteId) => {
  return api.post(`/book/quote/like/${quoteId}`);
};


/**
 * 🧠 OCR 이미지 텍스트 추출
 * @param {object} imageAsset - 이미지 asset 객체 (base64 포함)
 * @returns {Promise<string>} 추출된 텍스트
 */
export const extractTextFromImage = (imageAsset) => {
  const formData = new FormData();
  formData.append('image', {
    uri: `data:image/jpeg;base64,${imageAsset.base64}`,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  return api.post('/book/quote/ocr', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data.text);
};

/**
 * 🔥 전체 인기 인용 리스트 조회
 * 좋아요 수 + 작성일 기반 점수로 인기순 정렬됨
 * 오래된 인용도 좋아요 많으면 상위 유지됨
 * 최신 인용은 일시적으로 상위 노출 가능
 *
 * @param {number} offset - 시작 인덱스 (기본값 0)
 * @param {number} limit - 개수 (기본값 10)
 */
export const getPopularBookQuotes = (offset = 0, limit = 10) => {
  return api.get('/book/quote/popular', {
    params: { offset, limit },
  });
};
