import { format, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaShapes } from "react-icons/fa6";
import { LuPackageOpen } from "react-icons/lu";
import CardCompo from "../card/CardCompo";
import "./OverviewUser.css";
import { getSoapsMonthUser } from "./UserService";

import SoapsByMonth from "./charts/SoapsByMonth";
import SoapsByShape from "./charts/SoapsByShape";
import Grid from "@mui/material/Grid";

const OverviewUser = () => {
  const [soapsMonth, setSoapsMonth] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [totalSoaps, setTotalSoaps] = useState(0);

  const calculateTotalSoaps = (data) => {
    return data.reduce((total, item) => total + item.soaps, 0);
  };

  const getSoapsMonthPadded = (responseData) => {
    const today = new Date();
    const paddedResult = [];

    // Create a map of existing data for quick lookup
    const dataMap = new Map();
    responseData.forEach((item) => {
      dataMap.set(item.month, item);
    });

    // Generate last 6 months in reverse chronological order (newest first)
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(date, "yyyy-MM");

      if (dataMap.has(monthKey)) {
        paddedResult.push(dataMap.get(monthKey));
      } else {
        paddedResult.push({
          color: 0, // Default color or calculate based on month
          month: monthKey,
          "월별 수량": 0,
        });
      }
    }

    return paddedResult;
  };

  useEffect(() => {
    const getSoapsMonth = async () => {
      try {
        const userId = localStorage.getItem("LOGIN_ID");
        const response = await getSoapsMonthUser(userId);
        const responseData = response.data;
        console.log("비누 수량/월:", JSON.stringify(responseData));
        const chartData = responseData.map((soapCount) => ({
          ...soapCount,
          "월별 수량": soapCount.soaps,
          color: "#87a15e",
        }));
        console.log("chartData: ", JSON.stringify(chartData));

        const soapsMonthPadded = getSoapsMonthPadded(chartData);
        console.log("padded: ", soapsMonthPadded);
        setSoapsMonth(soapsMonthPadded);

        const total = calculateTotalSoaps(responseData);
        setTotalSoaps(total);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    getSoapsMonth();
  }, []);

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Card id="chartMonth" className="chartUser">
          <CardCompo
            label={"최근 6 개월 구매 합계"}
            count={totalSoaps}
            IconCompo={LuPackageOpen}
          />
          <div className="chart-container">
            {soapsMonth && soapsMonth.length > 0 && (
              <div className="chartDiv byMonth">
                <SoapsByMonth totalSoaps={totalSoaps} soapsMonth={soapsMonth} />
              </div>
            )}
          </div>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Card id="chartShape" className="chartUser">
          <CardCompo
            label={"최근 6 개월 구매 외형 비중"}
            count={totalSoaps}
            IconCompo={FaShapes}
          />
          <div className="chart-container">
            <div className="chartDiv">
              <SoapsByShape totalSoaps={totalSoaps} />
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OverviewUser;
