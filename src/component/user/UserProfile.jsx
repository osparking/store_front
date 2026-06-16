import Grid from "@mui/material/Grid";
import { useState } from "react";
import { Button, Row } from "react-bootstrap";
import BsAlertHook from "../hook/BsAlertHook";
import { deleteUserPhoto } from "../modal/ImageService";
import PasswordCard from "./details/PasswordCard";
import UserInfoCard from "./details/UserInfoCard";
import "./UserProfile.css";

const UserProfile = ({ user, setShowDetails, readOnly = false }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const loginId = localStorage.getItem("LOGIN_ID");
  const isAdmined = Number(loginId) !== user.id;
  const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN"));
  const [show2FA_modal, setShow2FA_modal] = useState(false);

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

  const [showPhotoDelModal, setShowPhotoDelModal] = useState(false);
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

  const confirmPhotoRemoval = () => {
    setShowPhotoDelModal(true);
  };

  return (
    <>
      <div style={{ width: "100%", maxWidth: "701px", margin: "0 auto" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <PasswordCard user={user} readOnly={readOnly} />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <UserInfoCard
              user={user}
              readOnly={readOnly}
              isAdmined={isAdmined}
            />
          </Grid>
        </Grid>
      </div>
      {isAdmined && (
        <Row>
          <div className="returnLink">
            <Button onClick={() => setShowDetails(false)}>목록으로</Button>
          </div>
        </Row>
      )}
    </>
  );
};

export default UserProfile;
