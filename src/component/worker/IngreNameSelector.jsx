import React, { forwardRef, useEffect, useState } from "react";
import { getAllIngreNames } from "./WorkerService";
import { Form, Row } from "react-bootstrap";
import AdderModal from "../modal/AdderModal";

const IngreNameSelector = forwardRef(({ ingreName, onChange }, ref) => {
  const [ingreNames, setIngreNames] = useState([]);
  const [showNameAdder, setShowNameAdder] = useState(false);

  useEffect(() => {
    const readIngreNames = async () => {
      try {
        const response = await getAllIngreNames();
        setIngreNames(response.data);
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
    if (newName && !ingreNames.includes(newName)) {
      setIngreNames([...ingreNames, newName]);
      onChange({ target: { name: "ingreName", value: newName } });
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Row} controlId="password" className="mb-4">
        <Form.Label>재료 명칭</Form.Label>
        <Form.Control
          as="select"
          name="ingreName"
          value={ingreName}
          required
          onChange={handleIngreName}
          ref={ref}
        >
          <option value="">(재료명 선택)</option>
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
        label={"재료"}
        saver={handleNewName}
        dialogClass="modal-50w"
      />

      {/* Gray backdrop overlay when child modal is open */}
      {showNameAdder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
            pointerEvents: "none", // Allows clicks to pass through if needed
          }}
        />
      )}
    </React.Fragment>
  );
});

export default IngreNameSelector;
