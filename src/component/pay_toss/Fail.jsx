import { Button, Container } from "react-bootstrap";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

export function FailPage() {
  const [searchParams] = useSearchParams();
  const userId = localStorage.getItem("LOGIN_ID");
  const navigate = useNavigate();

  const toDashBoard = () => {
    navigate(`/dashboard/${userId}/user`, { replace: true });
  };

  return (
    <Container id="fail_page">
      <div
        id="info"
        className="box_section"
        style={{ width: "600px", height: "450px" }}
      >
        <img
          width="100px"
          src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
          alt="에러 이미지"
        />
        <h2>결제에 실패했습니다</h2>

        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>에러메시지</b>
          </div>
          <div
            className="p-grid-col text--right"
            id="message"
          >{`${searchParams.get("message")}`}</div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="text--left">
            <b>에러코드: </b>&nbsp;
          </div>
          <div className="text--left" id="code">{`${searchParams.get(
            "code",
          )}`}</div>
        </div>
        <div>
          <Button onClick={toDashBoard}>대시보드로 가기</Button>
        </div>
      </div>
    </Container>
  );
}
