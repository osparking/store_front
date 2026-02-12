import { Button, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { FaMinusSquare } from "react-icons/fa";
import "../orderForm.css";

const OrderTable = ({
  orderItems,
  optionLabels,
  handleInputChange,
  changeCarouselShape,
  delSoapItem,
}) => {
  function handleShapeChange(e, index) {
    const currShapes = orderItems.map((item) => item.shape);
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
      handleInputChange(index, e);
      changeCarouselShape(idx - 1);
    }
  }

  function handleCountChange(e, item, index) {
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
    handleInputChange(index, e);
  }

  const soapPriceTotal = () => {
    console.log(JSON.stringify(orderItems));
    return orderItems.reduce(
      (subTotal, item) => {
        return {
          count: subTotal.count + Number(item.count),
          price: subTotal.price + item.price * item.count,
        };
      },
      { count: 0, price: 0 },
    );
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th style={{ width: "180px" }}>외형</th>
          <th style={{ width: "80px" }}>수량</th>
          <th style={{ width: "105px" }}>가격</th>
          <th style={{ width: "40px" }}>삭제</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, index) => (
          <tr key={index} className="orderRow">
            <td>
              <Form.Control
                as="select"
                name="shape"
                value={item.shape}
                required
                onChange={(e) => handleShapeChange(e, index)}
                onFocus={(e) => changeCarouselShape(e.target.selectedIndex - 1)}
                style={{paddingRight: 0}}
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
            </td>
            <td>
              <Form.Control
                type="number"
                className="text-end"
                name="count"
                id={`soapCount${index}`}
                min="1"
                max={item.inventory}
                value={item.count}
                placeholder="수량"
                onChange={(e) => handleCountChange(e, item, index)}
                required
                style={{paddingRight: 6}}
              />
            </td>
            <td className="text-end" style={{ padding: "8px" }}>
              {(item.price * item.count).toLocaleString()}원
            </td>
            <td>
              {index > 0 && (
                <div className="d-flex justify-content-end">
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
            </td>
          </tr>
        ))}
        <tr>
          <td className="text-center fw-bold">소계</td>
          <td className="text-end fw-bold" style={{ paddingRight: "28px" }}>
            {soapPriceTotal().count}
          </td>
          <td className="fw-bold text-end">
            {soapPriceTotal().price.toLocaleString()}원
          </td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default OrderTable;
