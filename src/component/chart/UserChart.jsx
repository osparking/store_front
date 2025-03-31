import React, { useEffect, useState } from 'react'
import { getUserByMonthType } from '../user/UserService';

const UserChart = () => {
  const [userStat, setUserStat] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  
  useEffect(() => {
    const getUserRegisterStat = async () => {
      try {
        const userRegister = await getUserByMonthType();
        const userStat = await userRegister.data;
        if (userRegister) {
          setUserStat(userStat);
          const chartData = Object.entries(userStat).map(
            ([month, userCount]) => {
              return {
                name: month,
                노동자: userCount.노동자 || 0,
                고객: userCount.고객 || 0,
              };
            }
          );
          console.log("chartData:", chartData);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setErrorMsg("유저 등록 통계 오류: ", err.message)
      }
    };
    getUserRegisterStat();
  }, []);

  return (
    <div>유저 등록 현황</div>
  )
}
 
export default UserChart