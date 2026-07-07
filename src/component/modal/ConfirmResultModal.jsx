import { Button, Modal } from "react-bootstrap";
import "./ConfirmResultModal.css";

const ConfirmResultModal = ({
  show,
  closer,
  switchLabel,
  dialogClass,
  expireTime = "미설정",
}) => {
  const getModalTitle = () => {
    switch (switchLabel) {
      case "제출 요청 접수됨":
        return "활성화 다음 단계";
        break;
      
      case "비밀번호리셋":
        return "비밀번호 재 설정";
        break;

      default:
        return "이메일 소유 확인 결과";
    }
  };

  const getModalMessage = () => {
    switch (switchLabel) {
      case "계정 활성화":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              *이메일 주소 검증 성공*
            </p>
            <p style={{ textAlign: "center" }}>
              귀하께서는 이제 <b>로그인이 가능</b>합니다.
            </p>
          </>
        );
      case "토큰 재발급됨":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              회원님의 이메일 주소 검증을 위하여...
            </p>
            <p>
              귀하께 <b>새 이메일이 발송</b>되었으니, 이메일에 포함된{" "}
              <b>링크를 클릭</b>하여 계정을 활성화하십시오.
            </p>
          </>
        );
      case "제출 요청 접수됨":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              회원님의 계정 활성화를 위하여...
            </p>
            <p>
              귀하께 <b> 이메일이 발송</b>되었습니다.<br />
              이메일 내포 <b>링크를 클릭</b>하면 활성화가 완료됩니다.
            </p>
            <p style={{ textAlign: "center" }}>
              (* 링크 폐기 시간: {expireTime} *)
            </p>
          </>
        );
      case "폐기된 토큰":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              *폐기된 토큰*
            </p>
            <p style={{ textAlign: "center" }}>
              제출한 토큰은 폐기 처분된 것입니다.
            </p>
          </>
        );
      case "이미 검증된 토큰":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              *기 검증 이메일 주소*
            </p>
            <p style={{ textAlign: "center" }}>
              귀하의 이메일 주소는 이미 검증되었습니다.
            </p>
          </>
        );
      case "비밀번호리셋":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              *비밀번호 재 설정 메일 발송됨*
            </p>
            <p style={{ textAlign: "center" }}>
              이메일을 열고, 링크를 클릭하십시오.<br/>
              [링크 유효기간: ~{expireTime}]</p>
          </>
        );
      default:
        return (
          <p className="text-danger mb-3" style={{ textAlign: "center" }}>
            예외적인 스위치 라벨: {switchLabel}
          </p>
        );
    }
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName={dialogClass}>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getModalMessage()}</Modal.Body>
      <Modal.Footer className="char2button">
        <Button variant="secondary" onClick={closer} className="p-0">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmResultModal;
