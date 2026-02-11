import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import placeholder from "../../assets/images/placeholder.png";

const EmpImage = ({ empPhoto, altText = "직원 사진" }) => {
  return (
    <Fragment>
      {empPhoto ? (
        <Card.Img style={{width: "100px"}}
          src={`data:image/png;base64, ${empPhoto}`}
          className="user-image"
          alt={altText}
        />
      ) : (
        <Card.Img src={placeholder} className="user-image" alt={altText} />
      )}
    </Fragment>
  );
};

export default EmpImage;
