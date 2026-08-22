import { useContext, useEffect, useState } from "react";
import { Legend, Pie, PieChart, Sector, Tooltip } from "recharts";
import NoDataExists from "../../common/NoDataExists";
import useColorMapping from "../../hook/ColorMapping";
import { getShapeCount } from "../../user/UserService";
import { ReviewsContext } from "../UserDashboard";

const SoapsByShape = ({ totalSoaps }) => {
  const { statVersion } = useContext(ReviewsContext);  
  const [shapeCount, setShapeCount] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSoapShapeStat = async () => {
      setIsLoading(true); // 요청 시작
      try {
        const userId = localStorage.getItem("LOGIN_ID");
        const result = await getShapeCount(userId);
        setShapeCount(result.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false); // 어떤 상황에도 로딩 깃발 내림
      }
    };
    getSoapShapeStat();
  }, [statVersion]);

  const colors = useColorMapping();

  // 🎨 CSS 스피너 스타일 (컴포넌트 내부에 정의)
  const spinnerStyle = {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderLeftColor: "#09f",
    animation: "spin 1s ease infinite",
  };

  // 스피너 CSS (react-spinners 대신 사용)
  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <h5
        className="chart-title mb-1 p-1"
        style={{ backgroundColor: "hsl(83, 26%, 50%)", color: "ivory" }}
      >
        비누 외형 비중
      </h5>

      {/* 차트 영역을 감싸는 컨테이너 */}
      <div style={{ position: "relative", width: "316px", height: "250px" }}>
        {/* style 태그로 keyframes 주입 (한 번만 렌더링되도록 최상단에 배치) */}
        <style>{keyframesStyle}</style>

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: 10,
              borderRadius: "8px",
            }}
          >
            {/* 🌀 순수 CSS 스피너 적용 */}
            <div style={spinnerStyle} />
          </div>
        )}

        {/* 데이터가 없을 때 */}
        {!isLoading && totalSoaps === 0 ? (
          <NoDataExists width={316} height={250} dataType={""} />
        ) : (
          // 데이터가 있을 때 차트 렌더링 (로딩 중에도 차트는 그려지지만 오버레이로 가려짐)
          !isLoading && (
            <PieChart
              width={"316px"}
              height={"250px"}
              className="p-1 userChartBackground"
            >
              <Pie
                data={shapeCount}
                dataKey="count"
                nameKey="shapeLabel"
                label={({ shapeLabel, count, percent }) =>
                  `수량: ${Math.trunc(count)} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={45}
                fill="#8884d8"
                shape={(props) => (
                  <Sector {...props} fill={colors[props.shapeLabel]} />
                )}
                isAnimationActive={false}
              />
              <Tooltip
                formatter={(value, name) => [`${Math.trunc(value)}개`, name]}
              />
              <Legend
                layout="horizontal"
                formatter={(value, entry) => {
                  return <span style={{ color: colors[value] }}>{value}</span>;
                }}
              />
            </PieChart>
          )
        )}
      </div>
    </>
  );
};

export default SoapsByShape;
