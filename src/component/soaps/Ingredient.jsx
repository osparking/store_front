import { Table } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import "./ingredient.css";

const ingAllRows = ingAllData.map((ingred) => (
  <tr className={ingred.id === "" ? "table-row" : ""}>
    <td>{ingred.id}</td>
    <td>{ingred.name}</td>
    <td class="text-center">{ingred.weight}</td>
    <td class="text-center">{ingred.incRate}</td>
    <td>{ingred.etcEffect}</td>
  </tr>
));

const IngredTable = () => {
  return (
    <Table striped bordered hover className="mt-3 w-75">
      <thead>
        <tr>
          <th>#</th>
          <th>재료명</th>
          <th class="text-center">중량(g)</th>
          <th class="text-center">함유비(%)</th>
          <th class="text-center">비고/효능</th>
        </tr>
      </thead>
      <tbody>{ingAllRows}</tbody>
    </Table>
  );
};

const Ingredient = () => {
  return (
    <div className="d-flex justify-content-center" >
      <IngredTable />
    </div>
  );
};

export default Ingredient;
