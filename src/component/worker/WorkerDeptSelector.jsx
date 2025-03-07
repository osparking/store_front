import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getAllDept } from "./WorkerService";

const WorkerDeptSelector = ({ workerDept }) => {
  const [workerDepts, setWorkerDepts] = useState([]);

  useEffect(() => {
    const readDepts = async () => {
      try {
        const response = await getAllDept();
        setWorkerDepts(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readDepts();
  }, []);

  return (
    <React.Fragment>
      <Form.Group>
        <Form.Control as="select" name="department" value={workerDept} required>
          <option value="">- 소속 부서 -</option>
          {workerDepts.map((dept, index) => (
            <option value={dept} key={index}>
              {dept}
            </option>
          ))}
          <option value="add_dept">(부서 추가)</option>
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );
};

export default WorkerDeptSelector;
