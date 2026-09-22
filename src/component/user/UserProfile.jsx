import Grid from "@mui/material/Grid";
import { Button, Row } from "react-bootstrap";
import BsAlertHook from "../hook/BsAlertHook";
import InfoCardUser from "./details/InfoCardUser";
import InfoCardWorker from "./details/InfoCardWorker";
import PasswordCard from "./details/PasswordCard";
import "./UserProfile.css";

const UserProfile = ({
  user,
  setShowDetails,
  readOnly = false,
  handleDeletion,
  fetchWorkerPage,
}) => {
  const loginId = localStorage.getItem("LOGIN_ID");
  const isAdmined = Number(loginId) !== user.id;

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

  return (
    <>
      <div style={{ width: "100%", maxWidth: "701px", margin: "0 auto" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <PasswordCard user={user} readOnly={isAdmined || readOnly} />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {isAdmined ? (
              <InfoCardWorker
                user={user}
                readOnly={readOnly}
                handleDeletion={handleDeletion}
                fetchWorkerPage={fetchWorkerPage}
              />
            ) : (
              <InfoCardUser
                user={user}
                readOnly={readOnly}
                handleDeletion={handleDeletion}
              />
            )}
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
