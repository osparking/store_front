import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./CartPutModal.css";

const CartPutModal = ({ show, closer, getResultString = [] }) => {
  const navigate = useNavigate();

  const showShoppingCart = () => {
    navigate("/shopping_cart", { state: { showCart: true } });
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName={"cart-put-modal"}>
      <Modal.Header closeButton>
        <Modal.Title>장바구니 담은 결과</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>변경 내용 요약</h5>
        <ul style={{ margin: "0 0 0 20px" }}>
          {getResultString.length > 0 ? (
            getResultString.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>장바구니에 담긴 상품이 없습니다</li>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <div
          style={{ width: "100%" }}
          className="char4button d-flex justify-content-center gap-3"
        >
          <Button
            variant="info"
            size="sm"
            className="order-button-width"
            onClick={showShoppingCart}
          >
            바구니 보기
          </Button>
          <Button
            variant="success"
            size="sm"
            className="order-button-width"
            onClick={closer}
            style={{ minWidth: "95px" }}
          >
            비누 주문
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CartPutModal;
