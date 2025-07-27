import { getAllIngreNames } from "./WorkerService";

const IngreNameSelector = () => {
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
  return <div></div>;
};

export default IngreNameSelector;
