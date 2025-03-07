import React, { useEffect, useState } from "react";
import { getAllDept } from "./WorkerService";

const WorkerDeptSelector = () => {
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
  return <div></div>;
};

export default WorkerDeptSelector;
