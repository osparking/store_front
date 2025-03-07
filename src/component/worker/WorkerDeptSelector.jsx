import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import AdderModal from "../modal/AdderModal";
import { getAllDept } from "./WorkerService";

const WorkerDeptSelector = ({ workerDept, onChange }) => {
  const [chosenDept, setChosenDept] = useState(workerDept);
  const [workerDepts, setWorkerDepts] = useState([]);
  const [showDeptAdder, setShowDeptAdder] = useState(false);

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

  const handleDept = (event) => {
    if (event.target.value === "add_dept") {
      setShowDeptAdder(true);
    } else {
      onChange(event);
    }
  };

  const handleNewDept = (newDept) => {
    if (newDept && !workerDepts.includes(newDept)) {
      setWorkerDepts([...workerDepts, newDept]);
      onChange({ target: { name: "dept", value: newDept } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group>
        <Form.Control
          as="select"
          name="department"
          value={chosenDept}
          required
          onChange={handleDept}
        >
          <option value="">- 소속 부서 -</option>
          {workerDepts.map((dept, index) => (
            <option value={dept} key={index}>
              {dept}
            </option>
          ))}
          <option value="add_dept">(새 부서)</option>
        </Form.Control>
      </Form.Group>
      <AdderModal
        show={showDeptAdder}
        closer={() => {
          setShowDeptAdder(false);
          setChosenDept("");
        }}
        label={"부서"}
        saver={handleNewDept}
      />
    </React.Fragment>
  );
};

export default WorkerDeptSelector;
