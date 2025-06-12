import api from './api';

/**
 * 📆 월별 독서 썸네일 조회 API
 * 사용자가 특정 연/월에 책장에 담았거나 완독한 책 중 하루에 한 권씩(썸네일 포함) 반환함
 * 책장 등록한 책이 우선이며, 없을 경우 해당 날짜의 완독 책 중 최신 순으로 선택됨
 * @param {number} year - 연도 (예: 2025)
 * @param {number} month - 월 (1~12)
 * @returns {Promise<MonthlyCalendarThumbnailResponseDto>}
 */
export const getMonthlyCalendarThumbnails = ({ year, month }) => {
  return api.get('/calendar/books/monthly', {
    params: { year, month },
  });
};

/**
 * 📅 일별 책 활동 상세 조회 API
 * 특정 날짜에 책장에 담았거나 완독 처리한 모든 책을 반환함
 * 두 경우를 구분하여 shelvedBooks, finishedBooks 로 나눠 제공함
 * @param {string} date - 조회할 날짜 (형식: "yyyy-MM-dd", 예: "2025-06-11")
 * @returns {Promise<DailyCalendarResponseDto>}
 */
export const getDailyCalendarDetails = (date) => {
  return api.get('/calendar/books/daily', {
    params: { date },
  });
};
