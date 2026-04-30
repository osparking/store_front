import "./NoDataExists.css";

const NoDataExists = ({ width, height, dataType }) => {
  return (
    <div className="center-container" style={{ width, height }}>
      <h6>{dataType} 자료 없음</h6>
    </div>
  );
};

export default NoDataExists;
