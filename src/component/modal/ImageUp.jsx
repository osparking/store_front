import React, { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

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
      if (user.photo) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async (e) => {
          const fileBytes = new Unit8Array(e.target.result);
          const result = await updateEmpPhoto(user.photoId, fileBytes);
          setSuccessMsg(result.data);
          window.location.reload();
          setAlertSuccess(true);
        };
      }
    } catch (error) {}
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup>
            <Form.Control type="file">
              <Button variant="secondary" onClick={handleImageUp}>
                올리기
              </Button>
            </Form.Control>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImageUp;
