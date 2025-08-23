import "./unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="center">
      <div>방금 비 인가된 페이지 접근을 시도하셨습니다.</div>
      <p>
        <a href="/login">로그인 페이지</a>
      </p>
    </div>
  );
};

export default Unauthorized;
