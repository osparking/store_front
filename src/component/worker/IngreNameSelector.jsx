import React, { useEffect, useState } from "react";
import { getAllIngreNames } from "./WorkerService";
import { Form } from "react-bootstrap";
import AdderModal from "../modal/AdderModal";

const IngreNameSelector = ({ingreName, onChange}) => {
  const [ingreNames, setIngreNames] = useState([]);
  const [showNameAdder, setShowNameAdder] = useState(false);

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
  
  const handleIngreName = (event) => {
    if (event.target.value === "add_name") {
      setShowNameAdder(true);
    } else {
      onChange(event);
    }
  };

  const handleNewName = (newName) => {
    console.log("새 이름: " + newName);
    if (newName && !ingreNames.includes(newName)) {
      setIngreNames([...ingreNames, newName]);
      onChange({ target: { name: "ingreName", value: newName } });
    }
  };  

  return (
    <React.Fragment>
      <Form.Group>
        <Form.Label>재료 명칭</Form.Label>
        <Form.Control
          as="select"
          name="ingreName"
          value={ingreName}
          required
          onChange={handleIngreName}
        >
          <option value="">- 재료 명칭 -</option>
          {ingreNames.map((name, index) => (
            <option value={name} key={index}>
              {name}
            </option>
          ))}
          <option value="add_name">(재료 명칭 추가)</option>
        </Form.Control>
      </Form.Group>
      <AdderModal
        show={showNameAdder}
        closer={() => {
          setShowNameAdder(false);
          console.log("false called");
        }}
        label={"재료 이름"}
        saver={handleNewName}
      />
    </React.Fragment>
  );  
};

export default IngreNameSelector;
