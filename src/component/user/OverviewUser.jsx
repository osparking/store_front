import { format, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaShapes } from "react-icons/fa6";
import { LuPackageOpen } from "react-icons/lu";
import { ResponsiveContainer } from "recharts";
import CardCompo from "../card/CardCompo";
import SoapShapeRatio from "../chart/SoapShapeRatio";
import SoapsMonthUser from "../chart/SoapsMonthUser";
import NoDataExists from "../common/NoDataExists";
import "./OverviewUser.css";
import { getSoapsMonthUser } from "./UserService";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
          color: "hsl(83, 26%, 50%)",
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
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center chart-row">
        <Col lg={5} md={6} xs={12} className="chartUserCol">
          <Card className="chartUser h-100">
            <CardCompo
              label={"최근 6 개월 구매 합계"}
              count={totalSoaps}
              IconCompo={LuPackageOpen}
            />
            <div className="chart-container">
              {soapsMonth && soapsMonth.length > 0 && (
                <div className="chartDiv">
                  <ResponsiveContainer className="userChart">
                    <h5
                      className="chart-title mb-1 p-1"
                      style={{
                        backgroundColor: "hsl(83, 26%, 50%)",
                        color: "ivory",
                      }}
                    >
                      비누 구매 수량{" "}
                    </h5>

                    {totalSoaps > 0 ? (
                      <BarChart
                        data={soapsMonth}
                        style={{ backgroundColor: "white" }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          angle={-30}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis
                          width={40}
                          tick={{ fill: "#232a31ff", fontSize: 15 }}
                          axisLine={{ stroke: "#495057" }}
                        />
                        <Tooltip />
                        <Bar dataKey="월별 수량">
                          {soapsMonth.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <NoDataExists
                        dataType={""}
                      />
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col lg={5} md={6} xs={12} className="chartUserCol">
          <Card className="chartUser h-100">
            <CardCompo
              label={"최근 6 개월 구매 외형 비중"}
              count={totalSoaps}
              IconCompo={FaShapes}
            />
            <div className="chart-container">
              <SoapShapeRatio />
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OverviewUser;
