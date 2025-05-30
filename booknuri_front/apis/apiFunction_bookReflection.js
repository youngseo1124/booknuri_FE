import api from './api';


/**
 * ✅ 특정 책에 대해 독후감 작성 여부 확인
 * @param {string} isbn13 - 책 ISBN13
 * @returns {Promise} alreadyReflected: true | false
 */
export const checkAlreadyReflected = (isbn13) => {
  return api.get(`/book/reflection/exist/${isbn13}`);
};

/**
 * ✍️ 독후감 작성
 **/
export const createReflection = (data) => {
  return api.post('/book/reflection', data);
};

/**
 * 📤 독후감 이미지 업로드 (여러 장 가능)
 * @param {number} reflectionId - 업로드 대상 독후감 ID
 * @param {FormData} images - 이미지 파일들 (FormData로 전달)
 * @returns {Promise} 업로드된 이미지 URL 배열
 */
export const uploadReflectionImages = (reflectionId, images) => {
  return api.post(`/book/reflection/${reflectionId}/upload`, images, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * ✏️ 내가 작성한 독후감 불러오기 (수정용)
 * @param {string} isbn13 - 책 ISBN13
 * @returns {Promise} 독후감 정보 + 이미지 목록 포함
 */
export const getMyReflectionByIsbn = (isbn13) => {
  return api.get(`/book/reflection/my/${isbn13}`);
};

/**
 * 🛠️ 독후감 수정
 * @param {object} data - 수정할 독후감 정보
 * @param {number} data.reflectionId - 독후감 ID
 * @param {string} data.content - 수정 내용
 * @param {number} data.rating - 별점
 * @param {boolean} data.containsSpoiler - 스포 포함 여부
 * @param {boolean} data.visibleToPublic - 공개 여부
 * @returns {Promise} 수정 성공 메시지
 */
export const updateReflection = (data) => {
  return api.put('/book/reflection', data);
};

/**
 * ❌ 독후감 이미지 하나 삭제 (수정 화면에서 사용)
 * @param {number} imageId - 삭제할 이미지 ID
 * @returns {Promise} 삭제 성공 메시지
 */
export const deleteReflectionImage = (imageId) => {
  return api.delete(`/book/reflection/image/${imageId}`);
};

/**
 * 🗑️ 독후감 삭제 (본인만 가능)
 * @param {number} reflectionId - 삭제할 독후감 ID
 * @returns {Promise} 삭제 성공 메시지
 */
export const deleteReflection = (reflectionId) => {
  return api.delete(`/book/reflection/${reflectionId}`);
};

/**
 * 👍 독후감 좋아요/취소 (토글형식)
 * @param {number} reflectionId - 좋아요 누를 독후감 ID
 * @returns {Promise} liked: true(성공) | false(취소)
 */
export const toggleLikeReflection = (reflectionId) => {
  return api.post(`/book/reflection/like/${reflectionId}`);
};

/**
 * 📃 특정 책의 모든 독후감 조회 (공개글만, 정렬 + 페이지네이션 지원)
 * @param {string} isbn13 - 책 ISBN13
 * @param {string} sort - 정렬 방식: new | like | high | low (기본값: like)
 * @param {number} offset - 시작 인덱스 (기본값: 0)
 * @param {number} limit - 한 번에 가져올 개수 (기본값: 10)
 * @returns {Promise} 독후감 리스트 + 평균 평점 + 별점 분포
 */
export const getBookReflectionList = (isbn13, sort = 'like', offset = 0, limit = 10) => {
  return api.get(`/book/reflection/list/${isbn13}`, {
    params: { sort, offset, limit },
  });
};
