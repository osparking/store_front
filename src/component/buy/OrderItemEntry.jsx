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
      const maxCount = optionLabels[idx - 1].count;
      const countElement = document.getElementById(`soapCount${index}`);

      if (countElement) {
        countElement.max = maxCount;
        if (parseInt(item.count) > maxCount) {
          item.count = maxCount;
        }
      }
      handleInputChange(e);
      changeCarouselShape(idx - 1);
    }
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
        >
          <option value="" disabled>
            - 외형 선택 -{" "}
          </option>
          {/* Populate options dynamically based on shapeLabels */}
          {shapeLabels.map((shape, idx) => (
            <option
              value={shape.shapeLabel}
              key={idx}
              disabled={shape.count === 0}
            >
              {shape.count > 0
                ? `${shape.shapeLabel}(재고: ${shape.count})`
                : `${shape.shapeLabel}(품절)`}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col md={4}>
        <Form.Control
          type="number"
          name="count"
          id={`soapCount${index}`}
          min="1"
          max={item.maxCount}
          value={item.count}
          placeholder="개수 입력"
          onChange={handleInputChange}
          required
        />
      </Col>
      <Col md={1}>
        {canRemove && (
          <div className="d-flex justify-content-end mt-1">
            <OverlayTrigger overlay={<Tooltip>항목 제거</Tooltip>}>
              <Button
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
