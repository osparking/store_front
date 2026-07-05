import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import EmpImage from "../../common/EmpImage";
import ChangePassword from "../../modal/ChangePassword";
import DeleteConfirmModal from "../../modal/DeleteConfirmModal";
import DisableAccountModal from "../../modal/DisableAccountModal";
import { deleteUserPhoto } from "../../modal/ImageService";
import ImageUp from "../../modal/ImageUp";
import "./../UserProfile.css";

const PasswordCard = ({ user, readOnly = false }) => {
  const [showPhotoDelModal, setShowPhotoDelModal] = useState(false);
  const confirmPhotoRemoval = () => {
    setShowPhotoDelModal(true);
  };

  const [showImageUp, setShowImageUp] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [showDelModal, setShowDelModal] = useState(false);
  const handleCloseAccountButtonCLick = () => {
    setShowDelModal(true);
  };
  const handleModalXButtonClick = () => {
    setShowDelModal(false);
  };

  const [delPhotoBtnDisabled, setDelPhotoBtnDisabled] = useState(false);
  const removePhoto = async () => {
    try {
      setDelPhotoBtnDisabled(true);
      const result = await deleteUserPhoto(user.id);
      window.location.reload();
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    } finally {
      setDelPhotoBtnDisabled(false);
    }
  };

  const loginId = localStorage.getItem("LOGIN_ID");
  const accountOwner = loginId == user.id;
  
  return (
    <Card
      id="passwordCard"
      className="text-center mb-3 shadow"
      style={{ height: "fit-content" }}
    >
      <DisableAccountModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        userId={loginId}
        target={""}
        disabled={false}
        modalClass={"disable-account-confirm"}
      />
      <Card.Body className="p-3">
        <div className="d-flex flex-column align-items-center justify-content-center">
          {!(user.userType === "고객") && (
            <>
              <EmpImage empPhoto={user.photoBytes} />
              {accountOwner && (
                <>
                  <p className="mt-5">
                    <Link to={"#"} onClick={() => setShowImageUp(true)}>
                      {user.photoBytes ? "사진 변경" : "사진 등록"}
                    </Link>
                  </p>
                  <p>
                    <Link
                      to={"#"}
                      {...(user.photoId
                        ? { onClick: confirmPhotoRemoval }
                        : { style: { cursor: "default", color: "grey" } })}
                    >
                      사진 제거
                    </Link>
                  </p>
                  <ImageUp
                    user={user}
                    show={showImageUp}
                    handleClose={() => setShowImageUp(false)}
                  />
                </>
              )}
            </>
          )}
          {accountOwner && (
            <p id="changePasswordLink">
              <Link to={"#"} onClick={() => setShowChangePassword(true)}>
                비밀번호 변경
              </Link>
            </p>
          )}

          <ChangePassword
            userId={user.id}
            show={showChangePassword}
            handleClose={() => setShowChangePassword(false)}
          />
        </div>
        {!readOnly && (
          <div className="d-flex justify-content-center mt-2 mb-2">
            <div className="mx-2 char4button">
              <Button
                id="disableAccountButton"
                size="sm"
                onClick={handleCloseAccountButtonCLick}
              >
                비활성화
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
      <DeleteConfirmModal
        show={showPhotoDelModal}
        onHide={() => setShowPhotoDelModal(false)}
        handleDeletion={removePhoto}
        target={"프로필 사진"}
        disabled={delPhotoBtnDisabled}
        modalClass="delete-photo-confirm"
      />
    </Card>
  );
};

export default PasswordCard;
