import "./NoDataExists.css";

const NoDataExists = ({ dataType }) => {
  return (
    <div className="center-container">
      <h6>{dataType}가 없습니다.</h6>
    </div>
  );
};

export default NoDataExists;
