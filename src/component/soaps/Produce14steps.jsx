import { useEffect, useState } from "react";
import "./Produce14steps.css";

const Produce14steps = ({ stepsInfo, keepOthersOpen }) => {
  const [produceSteps, setProduceSteps] = useState(null);

  useEffect(() => {
    if (stepsInfo) {
      setProduceSteps([
        ...stepsInfo.map((step) => ({
          ...step,
          toggled: false,
        })),
      ]);
    }
  }, []);

  function handleAccordionToggle(clickedItem) {
    setProduceSteps([
      ...produceSteps.map((step) => {
        let toggled = step.toggled;
        if (clickedItem.id === step.id) {
          toggled = !step.toggled;
        } else if (!keepOthersOpen) {
          toggled = false;
        }
        return { ...step, toggled };
      }),
    ]);
  }

  return (
    <div className="accordion-parent">
      {produceSteps?.map((produceStep, key) => {
        return (
          <div
            className={`accordion ${produceStep.toggled ? "toggled" : ""}`}
            style={{ display: "flex" }}
            key={key}
          >
            <div
              className="button-indicator-wrapper"
              id={`listItem.id === 4 ? "ingTable" : ""`}
            >
              <p>{produceStep.id}. </p>
              <button
                className="toggle"
                onClick={() => handleAccordionToggle(produceStep)}
                style={{
                  textDecoration:
                    produceStep.label === "끝" ? "none" : undefined,
                }}
              >
                <p>{produceStep.label}</p>
              </button>
              {produceStep.label !== "끝" && (
                <span className="direction-indicator simple">
                  {produceStep.toggled ? "一" : "十"}
                </span>
              )}
            </div>
            {produceStep.label !== "끝" && (
              <div className="content-parent">
                <div className="content pt-0">
                  {produceStep.renderContent(handleAccordionToggle)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Produce14steps;
