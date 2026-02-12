import { Form, Table } from "react-bootstrap";

const OrderTable = ({ orderItems, optionLabels, handleInputChange }) => {
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
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>외형</th>
          <th>수량</th>
          <th>가격</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, index) => (
          <tr key={index}>
            <td>
              <Form.Control
                as="select"
                name="shape"
                value={item.shape}
                required
                onChange={(e) => handleShapeChange(e, index)}
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
            </td>
            <td>{item.count}</td>
            <td>{(item.price * item.count).toLocaleString()}원</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrderTable;
