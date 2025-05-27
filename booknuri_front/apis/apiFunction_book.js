import api from './api';

//  특정 ISBN의 책 상세 정보 + 사용자 콘텐츠들 가져오기 (정적 정보 + 리뷰 + 인용 + 독후감)
export const getBookTotalInfo = (isbn13) => {
  return api.get(`/book/${isbn13}`);
};
