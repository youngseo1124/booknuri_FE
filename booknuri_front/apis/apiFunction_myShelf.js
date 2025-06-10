import api from './api';



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
 * ✅ 내 책장 책 목록 조회 (최신순, 상태 + 인생책 + 키워드 필터 가능)
 *
 * @param {number} page - 페이지 번호 (기본 0)
 * @param {number} size - 페이지당 항목 수 (기본 10)
 * @param {'WANT_TO_READ' | 'READING' | 'FINISHED'} [status] - 상태 필터 (없으면 전체 조회)
 * @param {boolean} [lifeBookOnly] - 인생책 필터 (true일 경우 인생책만)
 * @param {string} [keyword] - 책 제목 키워드 (부분 검색)
 * @returns {Promise<Page<MyShelfBookWithExtrasResponseDto>>}
 */
export const getMyShelfBooks = async (page = 0, size = 10, status, lifeBookOnly, keyword) => {
  const params = { page, size };

  if (status) params.status = status;
  if (lifeBookOnly) params.lifeBookOnly = lifeBookOnly;
  if (keyword) params.keyword = keyword;

  const res = await api.get(`/shelf-book/my`, { params });
  return res.data;
};

/**
 * ✅ 책장에서 책 삭제
 * 해당 ISBN13에 해당하는 책을 내 책장에서 제거함
 *
 * @param {string} isbn13 - 삭제할 책의 ISBN13
 * @returns {Promise<string>} - 성공 메시지
 */
export const removeBookFromShelf = async (isbn13) => {
  const res = await api.delete(`/shelf-book/remove/${isbn13}`);
  return res.data;
};


/**
 * ✅ 특정 책에 대해 내가 작성한 인용 목록 조회
 *
 * 로그인한 사용자가 특정 책(ISBN13 기준)에 대해 작성한 모든 인용을 불러온다.
 *
 * - 이 API는 로그인한 사용자 본인의 인용만 조회함 (공개 여부와 무관하게 모두 반환)
 * - 인용이 여러 개일 수 있으며, 최신순 또는 고정 정렬 없음 (서버 구현 기준)
 *
 * 응답 결과는 BookQuoteResponseDto 배열이며, 각 인용에는 스타일 정보, 작성 시간,
 * 좋아요 수, 좋아요 여부, 작성자 여부, 공개 여부, isbn13 등이 포함됨.
 *
 * @param {string} isbn13 - 인용을 조회할 책의 ISBN13 (예: '9791161571188')
 * @returns {Promise<BookQuoteResponseDto[]>} - 사용자가 해당 책에 쓴 인용 목록
 *
 * @example
 * const quotes = await getMyQuotesByBookIsbn("9791161571188");
 * console.log(quotes[0].quoteText);
 */
export const getMyQuotesByBookIsbn = async (isbn13) => {
  const res = await api.get(`/book/quote/my/isbn/${isbn13}`);
  return res.data;
};

/**
 * ✅ 내 책장에 있는 특정 책 1권 정보 조회 (shelfInfo만 반환)
 *
 * @param {string} isbn13 - 조회할 책의 ISBN13
 * @returns {Promise<{ shelfInfo: MyShelfBookResponseDto }>}
 *
 * @example
 * const { shelfInfo } = await getMyShelfBookByIsbn('9788937460449');
 * console.log(shelfInfo.bookname); // "데미안"
 */
export const getMyShelfBookByIsbn = async (isbn13) => {
  const res = await api.get(`/shelf-book/my/info/${isbn13}`);
  return res.data;
};


/**
 * ✅ 특정 책에 대해 내가 작성한 독후감 목록 조회
 *
 * 로그인한 사용자가 특정 책(ISBN13 기준)에 대해 작성한 모든 독후감을 반환함.
 *
 * - 해당 API는 로그인한 사용자 본인의 독후감만 반환함
 * - 공개 여부와 관계없이 반환되며, 비활성화된 독후감은 제외됨
 * - 응답은 BookReflectionResponseDto[] 배열이며, 각 독후감은 이미지, 좋아요 여부,
 *   작성자 여부, 스포일러 포함 여부, 공개 여부 등을 포함함
 *
 * @param {string} isbn13 - 독후감을 조회할 책의 ISBN13 (예: '9788998441012')
 * @returns {Promise<BookReflectionResponseDto[]>}
 *
 * @example
 * const reflections = await getMyReflectionsByBookIsbn('9788998441012');
 * console.log(reflections[0].title); // "자극적인 소재 없이도 재밌게 읽힌다"
 */
export const getMyReflectionsByBookIsbn = async (isbn13) => {
  const res = await api.get(`/book/reflection/my/isbn/${isbn13}`);
  return res.data;
};


/**
 * ✅ 내가 쓴 글이 있는 책 목록 조회 (리뷰 / 인용 / 독후감 중 선택)
 *
 * 로그인한 사용자가 작성한 글이 하나라도 있는 책 목록을 반환함.
 * - type 파라미터로 조회할 글 종류 지정: review | quote | reflection
 * - keyword 파라미터로 책 제목 또는 저자 키워드로 필터 가능 (선택)
 * - 책 하나에 여러 글이 있어도 가장 최근 작성 기준으로 정렬
 * - 각 책의 리뷰/인용/독후감 개수가 함께 포함됨
 *
 * @param {'review' | 'quote' | 'reflection'} type - 글 종류
 * @param {string} [keyword] - 책 제목 또는 저자 키워드 (선택)
 * @param {number} [page] - 페이지 번호 (기본 0)
 * @param {number} [size] - 페이지당 개수 (기본 10)
 * @returns {Promise<Page<BookInfoDto>>} - 작성한 글이 있는 책 목록 (페이징)
 *
 * @example
 * const res = await getMyGroupedWrittenBooks('quote', '데미안', 0, 5);
 * console.log(res.content[0].bookTitle); // '데미안'
 */
export const getMyGroupedWrittenBooks = async (
  type,
  keyword,
  page = 0,
  size = 10
) => {
  const params = { type, page, size };
  if (keyword) params.keyword = keyword;

  const res = await api.get(`/book/my/grouped`, { params });
  return res.data;
};
