import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { FaMinusSquare } from "react-icons/fa";
import "./cartItemRow.css";

const CartItemRow = ({
  index,
  item,
  formDataItems,
  optionLabels,
  handleInputChange,
  changeCarouselShape,
  delSoapItem,
}) => {
  function handleCountChange(e) {
    const inventory =
      optionLabels.find((label) =>
        label.optionLabel.startsWith(item.shapeLabel)
      )?.inventory || 1;
    if (parseInt(e.target.value) > inventory) {
      alert("재고를 초과할 수 없습니다.");
      e.target.value = inventory;
    } else if (parseInt(e.target.value) < 1) {
      alert("최소 1개 이상 입력해주세요.");
      e.target.value = 1;
    }
    handleInputChange(e);
  }

  return (
    <Row className="justify-content-center mb-3">
      <Col md={3}>
        <Form.Check
          className="cartItem"
          type="checkbox"
          checked={item.isChecked}
          label={item.shapeLabel}
          onChange={handleInputChange}
        />
      </Col>
      <Col md={2}>
        <Form.Control
          className="shapeCount"
          type="number"
          name="count"
          id={`soapCount${index}`}
          min="1"
          max={item.inventory}
          value={item.count}
          placeholder="수량"
          onChange={handleCountChange}
          required
        />
      </Col>
      <Col md={3}>
        <p className="cartItem">{item.subTotal.toLocaleString()} 원</p>
      </Col>
      <Col md={2}>
        <div className="d-flex justify-content-end mt-1">
          <OverlayTrigger overlay={<Tooltip>항목 제거</Tooltip>}>
            <Button
              style={{ padding: "0 .5rem .2rem" }}
              variant="danger"
              size="sm"
              onClick={() => delSoapItem(index)}
            >
              <FaMinusSquare />
            </Button>
          </OverlayTrigger>
        </div>
      </Col>
    </Row>
  );
};

export default CartItemRow;