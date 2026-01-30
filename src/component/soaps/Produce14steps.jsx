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

  const endSign = "끝";

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
              <p style={{color: "black"}}>
                {produceStep.label === endSign
                  ? produceStep.label
                  : produceStep.id}
                .
              </p>
              {produceStep.label !== endSign && (
                <button
                  className="toggle"
                  onClick={() => handleAccordionToggle(produceStep)}
                  style={{
                    textDecoration:
                      produceStep.label === endSign ? "none" : undefined,
                  }}
                >
                  <p>{produceStep.label}</p>
                </button>
              )}
              {produceStep.label !== endSign && (
                <span className="direction-indicator simple">
                  {produceStep.toggled ? "一" : "十"}
                </span>
              )}
            </div>
            {produceStep.label !== endSign && (
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
