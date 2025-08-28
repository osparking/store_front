import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CartPutModal = ({ show, closer, getResultString = [] }) => {
  console.log("type: ", typeof getResultString);
  console.log("getResultString: ", getResultString);
  const navigate = useNavigate();

  const showShoppingCart = () => {
    navigate("/shopping_cart", { state: { showCart: true } });
  };

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>장바구니 담은 결과</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>변경 내용 요약</h5>
        <ul>
          {getResultString.length > 0 ? (
            getResultString.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>장바구니에 담긴 상품이 없습니다</li>
          )}
        </ul>
        <div
          style={{ display: "flex", gap: "20px" }}
          className="justify-content-center"
        >
          <Button
            variant="info"
            size="sm"
            className="pt-2 pb-2 order-button-width"
            onClick={showShoppingCart}
          >
            바구니 보기
          </Button>
          <Button
            variant="success"
            size="sm"
            className="pt-2 pb-2 order-button-width"
            onClick={closer}
            style={{minWidth: '95px'}}
          >
            비누 주문
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default CartPutModal;
