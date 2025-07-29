import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getAllPackUnits } from "./WorkerService";

const UnitSelector = ({ packunit, onChange }) => {
  const [packunits, setPackunits] = useState([]);

  useEffect(() => {
    const readPackUnits = async () => {
      try {
        const response = await getAllPackUnits();
        setPackunits(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readPackUnits();
  }, []);

  return (
    <>
      <Form.Label>포장 단위</Form.Label>
      <Form.Control
        as="select"
        name="packunit"
        value={packunit}
        required
        onChange={onChange}
      >
        <option value="">-단위-</option>
        {packunits.map((name, index) => (
          <option value={name} key={index}>
            {name}
          </option>
        ))}
      </Form.Control>
    </>
  );
};

export default UnitSelector;
