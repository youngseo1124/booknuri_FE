import api from './api';

// 회원가입 (POST 요청)
export const join = (username, password, nickname, email) =>
  api.post(`/auth/join`, {
    username,
    password,
    nickname,
    email,
  });

// 자체로그인
export const login = (username, password) => {
  return api.post(
    '/userlogin',
    JSON.stringify({ username, password }), // ← 강제 JSON 문자열로
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

//카카오 로그인
export const kakaoLoginAPI = (id, nickname) => {
  return api.post('/auth/kakaologin', {
    id,
    nickname,
  });
};


// 회원가입시 아이디 중복 체크 (GET 요청)
export const checkUsername = (username) => api.get(`/auth/check/username/${username}`);

// 회원가입시 이메일 중복 체크 (GET 요청)
export const checkEmail = (email) => api.get(`/auth/check/email/${email}`);


// 로그인시 회원 정보 가져오기 (GET 요청)
export const userinfo = () => api.get(`/user/info`);





//  성별 설정
export const setUserGender = (gender) => {
  return api.patch('/user/sex', { gender });
};

//  출생년도 설정
export const setUserBirth = (birth) => {
  return api.patch('/user/birth', { birth });
};



// 전체 지역 조합 리스트 (시 + 구)
export const getRegionList = () => api.get('/library/region/all');

// 전체 도서관 (keyword 넣으면 검색, 없으면 전체)
export const getAllLibraries = ({ keyword = '', offset = 0, limit = 20 }) =>
  api.get('/library/all', { params: { keyword, offset, limit } });

//  특정 시 도서관 조회 (keyword 포함 가능)
export const getLibrariesBySi = ({ si, keyword = '', offset = 0, limit = 20 }) =>
  api.get('/library/search/region', {
    params: { si, keyword, offset, limit },
  });

//  시 + 구 도서관 조회 (keyword 포함 가능)
export const getLibrariesBySiGu = ({ si, gu, keyword = '', offset = 0, limit = 20 }) =>
  api.get('/library/search/region/detail', {
    params: { si, gu, keyword, offset, limit },
  });


// 도서관 설정 (libCode 넘김)
export const setMyLibrary = (libCode) =>
  api.patch('/user/my-library', { libCode });

