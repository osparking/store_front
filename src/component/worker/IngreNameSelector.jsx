import React, { useEffect, useState } from "react";
import { getAllIngreNames } from "./WorkerService";
import { Form } from "react-bootstrap";

const IngreNameSelector = ({ingreName}) => {
  const [ingreNames, setIngreNames] = useState([]);

  useEffect(() => {
    const readIngreNames = async () => {
      try {
        const response = await getAllIngreNames();
        setIngreNames(response.data);
        console.log("재료명 목록: ", response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readIngreNames();
  }, []);
  
  return (
    <React.Fragment>
      <Form.Group>
        <Form.Control as="select" name="ingreName" value={ingreName} required>
          <option value="">- 재료 명칭 -</option>
          {ingreNames.map((name, index) => (
            <option value={name} key={index}>
              {name}
            </option>
          ))}
          <option value="add_name">(재료 명칭 추가)</option>
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );  
};

export default IngreNameSelector;
