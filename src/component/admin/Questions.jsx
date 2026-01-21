import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Paginator from "../common/Paginator";
import {
  getMyQuestionsPage,
  getQuestion,
  getQuestionPage,
  saveAnswerAct,
} from "../user/question/QuestionService";
import "./Questions.css";
import QuestionFollowUpModal from "./QuestionFollowUpModal";

const Questions = ({ mine }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [questionPage, setQuestionPage] = useState({});
  const [questions, setQuestioins] = useState([]);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

  const savedPageNo = localStorage.getItem("QUESTION_PAGE_관리");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [searchResult, setSearchResult] = useState();
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadQuestionage = async () => {
    const searchResult = mine
      ? await getMyQuestionsPage(currentPage, pageSize)
      : await getQuestionPage(currentPage, pageSize);

    setSearchResult(searchResult);
    if (searchResult) {
      setTotalPages(searchResult.totalPages);
      setQuestionPage(searchResult.pageContent);
      setQuestioins(searchResult.pageContent.content);
      setPageSize(searchResult.pageSize);
      setCurrentPage(searchResult.currentPage);
    }
  };

  useEffect(() => {
    localStorage.setItem("QUESTION_PAGE_관리", currentPage);
    loadQuestionage();
  }, [currentPage]);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const [showQuestionFollowUpModal, setShowQuestionFollowUpModal] =
    useState(false);

  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    if (reloadPage) {
      loadQuestionage();
      setReloadPage(false);
    }
  }, [reloadPage]);

  const [question, setQuestion] = useState({});

  const answerQuestion = async (question) => {
    const theQuestion = await getQuestion(question.id);
    setQuestion({ ...theQuestion, answered: question.answered === "완료" });
    setShowQuestionFollowUpModal(true);
  };

  const saveAnswer = async (answer) => {
    setShowQuestionFollowUpModal(false);
    await saveAnswerAct(answer);
    loadQuestionage();
  };

  return (
    <div className="box_section w-900plus">
      <QuestionFollowUpModal
        show={showQuestionFollowUpModal}
        handleClose={() => setShowQuestionFollowUpModal(false)}
        question={question}
        saveAnswer={saveAnswer}
        mine={mine}
        setReloadPage={setReloadPage}
      />
      <div className="d-flex justify-content-center align-items-center">
        <h3>질문 목록</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-center text-muted mb-4">
          총 {questionPage.totalElements} 건 중, 제 {indexOfFirst + 1} ~{" "}
          {Math.min(idxLastPlus1, questionPage.totalElements)}번 질문
        </p>
      </div>
      <div
        id="questionTableDiv"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Table striped bordered hover className="questions">
          <thead>
            <tr>
              <th className="lightBlue">질문 제목(서두 15자)</th>
              <th className="lightBlue">질문 내용(서두 20자)</th>
              <th className="lightBlue">질문 일시</th>
              <th className="lightBlue">댓글</th>
              <th className="lightBlue">답변</th>
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
                  <td
                    className={question.answered === "대기" ? "attention" : ""}
                  >
                    {question.answered}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {searchResult && questionPage && (
        <Paginator
          pageSize={pageSize}
          totalItems={questionPage.totalElements}
          totalPages={totalPages}
          currPage={currentPage}
          setCurrPage={(pageNo) => setCurrentPage(pageNo)}
        />
      )}
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="info"
          onClick={() => goHome()}
          style={{ marginTop: "30px" }}
        >
          범이비누
        </Button>
      </div>
    </div>
  );
};

export default Questions;
