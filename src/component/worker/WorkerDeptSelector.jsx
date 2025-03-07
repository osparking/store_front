import React, { useEffect, useState } from "react";
import { getAllDept } from "./WorkerService";

const WorkerDeptSelector = () => {
  const [workerDepts, setWorkerDepts] = useState([]);

  useEffect(() => {
    const readDepts = async () => {
      try {
        const response = await getAllDept();
        setWorkerDepts(response.data);
        console.log("소속 목록: ", response.data);
      } catch (error) {
        console.error("소속 목록 채취 오류: ", error);
      }
    };
    readDepts();
  }, []);
  return <div></div>;
};

export default WorkerDeptSelector;
