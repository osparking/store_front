import "../../index.css";

const QuestionsTable = (questions, answerQuestion) => {
  const questionsTableWidth = "780px";
  const questionsTableColumnGroup = () => {
    return (
      <colgroup>
        <col style={{ width: "22%" }} />
        <col style={{ width: "30%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "06%" }} />
        <col style={{ width: "07%" }} />
      </colgroup>
    );
  };

  return (
    <div className="user-table-wrapper">
      <div className="table-header">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: questionsTableWidth,
            width: questionsTableWidth,
          }}
        >
          {questionsTableColumnGroup()}
          <thead>
            <tr className="userTableHeader">
              <th className="minDateWidth">제목 15 자</th>
              <th className="minDateWidthLong">내용 20 자</th>
              <th className="minDateWidth">질문 일시</th>
              <th>댓글</th>
              <th>답변</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-body my-review">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: questionsTableWidth,
            width: questionsTableWidth,
          }}
        >
          {questionsTableColumnGroup()}
          <tbody>
            {questions &&
              questions.map((question, idx) => (
                <tr key={idx}>
                  <td className="text-center">{question.title}</td>
                  <td className="text-start">
                    <a href="#" onClick={() => answerQuestion(question)}>
                      {question.question}
                    </a>
                  </td>
                  <td>{question.insertTime}</td>
                  <td>{question.followUpCount ?? 0}</td>
                  <td
                    className={question.answered === "대기" ? "attention" : ""}
                  >
                    {question.answered}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsTable;
