import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import placeholder from "../../assets/images/placeholder.png";

const EmployeeImage = ({ employeePhoto, altText = "직원 사진" }) => {
  return (
    <Fragment>
      {employeePhoto ? (
        <Card.Img
          src={`data:image/png;base64, ${employeePhoto}`}
          clasName="employee-image"
          alt={altText}
        />
      ) : (
        <Card.Img src={placeholder} className="employee-image" alt={altText} />
      )}
    </Fragment>
  );
};

export default EmployeeImage;
