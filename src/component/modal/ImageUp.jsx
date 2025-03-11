import React, { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { updatePhoto, uploadEmpPhoto } from "./ImageService";

const ImageUp = ({ user, show, handleClose }) => {
  console.log("유저: ", user);
  // * 원래 영상 소지 여부 검사
  //   - 여: 기존 영상 갱신
  //   - 부: 새로운 영상 업로드

  const [file, setFile] = useState(null);
  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const handleImageUp = async (e) => {
    e.preventDefault();
    try {
      let response = null;
      if (user.photoId) {
        response = await updatePhoto(user.photoId, file);
      } else {
        response = await uploadEmpPhoto(user.id, file);
      }
      window.location.reload();
      setSuccessMsg(response.data);
      setAlertSuccess(true);
    } catch (error) {
      console.error("error: ", error);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  }
  
  const handleFileChange = (e) => {
    console.log("file changed: ");
    setFile(e.target.files[0]);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>프로필 사진</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertSuccess && <AlertMessage type="success" message={successMsg} />}
        {alertError && <AlertMessage type="danger" message={errorMsg} />}
        <Form>
          <h6>프로필 사진을 선택하세요:</h6>
          <InputGroup>
            <Form.Control type="file" onChange={handleFileChange}/>
            <Button variant="secondary" onClick={handleImageUp}>
              올리기
            </Button>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImageUp;
