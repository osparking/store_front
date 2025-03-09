import React, { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { updateEmpPhoto, uploadEmpPhoto } from "./ImageService";

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
      const formData = new FormData();
      formData.append("file", file);
      const fileBytes = new Unit8Array(e.target.result);
      
      if (user.photoBytes) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async (e) => {
          const result = await updateEmpPhoto(user.photoId, fileBytes);
          window.location.reload();
          setSuccessMsg(result.data);
          setAlertSuccess(true);
        };
      } else {
        const response = await uploadEmpPhoto(user.id, fileBytes);
        window.location.reload();
        setSuccessMsg(response.data);
        setAlertSuccess(true);
      }
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
      console.error(error.message);
    }
  }

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
            <Form.Control type="file" />
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
