import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { FaMinusSquare } from "react-icons/fa";

const OrderItemEntry = ({
  index,
  item,
  formDataItems,
  optionLabels,
  handleInputChange,
  changeCarouselShape,
  canRemove = true,
  delSoapItem,
}) => {
  function handleShapeChange(e) {
    const currShapes = formDataItems.map((item) => item.shape);
    if (currShapes.includes(e.target.value)) {
      alert("중복 선택은 안됩니다. 다른 외형을 선택해주세요.");
    } else {
      const idx = e.target.selectedIndex;
      if (idx === 0) {
        alert("외형을 선택해주세요.");
        return;
      }
      const inventory = optionLabels[idx - 1].inventory;
      const countElement = document.getElementById(`soapCount${index}`);

      if (countElement) {
        countElement.max = inventory;
        if (parseInt(item.count) > inventory) {
          item.count = inventory;
        }
      }
      handleInputChange(e);
      changeCarouselShape(idx - 1);
    }
  }

  function handleCountChange(e) {
    const inventory =
      optionLabels.find((label) => label.optionLabel === item.shape)
        ?.inventory || 1;
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
      <Col md={5}>
        <Form.Control
          as="select"
          name="shape"
          value={item.shape}
          required
          onChange={handleShapeChange}
          onFocus={(e) => changeCarouselShape(e.target.selectedIndex - 1)}
        >
          <option value="">- 외형 선택 - </option>
          {/* Populate options dynamically based on optionLabels */}
          {optionLabels.map((label, idx) => (
            <option
              value={label.optionLabel}
              key={idx}
              disabled={label.inventory === 0}
            >
              {label.optionLabel}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col md={2}>
        <Form.Control
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
        <p
          style={{
            margin: "5px 10px",
            textAlign: "right",
          }}
        >
          {(item.price * item.count).toLocaleString()} 원
        </p>
      </Col>
      <Col md={1}>
        {canRemove && (
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
        )}
      </Col>
    </Row>
  );
};

export default OrderItemEntry;
