import { useState } from "react";

const StoIngEntry = () => {
  const [ingredient, setIngredient] = useState({
    ingreName: "",
    quantity: "",
    packunit: "",
    count: "",
    storeDate: "",
    buyPlace: "",
    workerId: "",
    expireDate: "",
  });

  return <div>StoIngEntry</div>;
};

export default StoIngEntry;
