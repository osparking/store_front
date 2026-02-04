import { Table } from "react-bootstrap";

const QuestionsTable = (questions, answerQuestion) => {
  return (
    <Table
      striped
      bordered
      hover
      className="questions"
      style={{ overflow: "auto" }}
    >
      <thead>
        <tr className="userTableHeader">
          <th>제목 15 자</th>
          <th>내용 20 자</th>
          <th className="minDateWidth">질문 일시</th>
          <th>댓글</th>
          <th>답변</th>
        </tr>
      </thead>
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
              <td className={question.answered === "대기" ? "attention" : ""}>
                {question.answered}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default QuestionsTable;
