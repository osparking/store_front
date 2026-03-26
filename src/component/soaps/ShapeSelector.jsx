import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import { getSoapShapeLabels } from "../worker/WorkerService";

const ShapeSelector = ({ shape, onChange }) => {
  const [shapeLabels, setShapeLabels] = useState([]);

  useEffect(() => {
    const readIngreNames = async () => {
      try {
        const response = await getSoapShapeLabels();
        setShapeLabels(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readIngreNames();
  }, []);

  const handleShapeChange = (event) => {
    onChange(event);
  };

  return (
    <React.Fragment>
      <Form.Group as={Row} controlId="password" className="mb-4">
        <Form.Label>비누 외형</Form.Label>
        <Form.Control
          as="select"
          name="shape"
          value={shape}
          required
          onChange={handleShapeChange}
        >
          <option value="">- 외형 선택 -</option>
          {shapeLabels.map((name, index) => (
            <option value={name} key={index}>
              {name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );
};

export default ShapeSelector;
