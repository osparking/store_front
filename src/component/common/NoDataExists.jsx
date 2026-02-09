import "./NoDataExists.css";

const NoDataExists = ({ dataType }) => {
  return (
    <div className="center-container">
      <h6>{dataType} 자료 없음</h6>
    </div>
  );
};

export default NoDataExists;
