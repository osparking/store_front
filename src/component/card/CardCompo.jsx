import React from "react";

const CardCompo = ({ label, count, IconCompo, chartName, scrollToChart }) => {
  return (
    <div
      className="admin-card header-card"
      onClick={() => scrollToChart(chartName)}
    >
      <div className="card-inner">
        {label}
        <IconCompo className="card-icon" />
      </div>
      <h3 className="text-center m-0">{count}</h3>
    </div>
  );
};

export default CardCompo;
