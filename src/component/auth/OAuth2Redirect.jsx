import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2Redirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 토큰을 localStorage 또는 Context에 저장
      localStorage.setItem('accessToken', token);
      // 홈페이지 또는 대시보드로 리다이렉트
      navigate('/');
    } else {
      // 토큰이 없으면 로그인 페이지로
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}