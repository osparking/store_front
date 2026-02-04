import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Paginator from "../common/Paginator";
import {
  getMyQuestionsPage,
  getQuestion,
  getQuestionPage,
  saveAnswerAct,
} from "../user/question/QuestionService";
import QuestionFollowUpModal from "./QuestionFollowUpModal";
import "./ManageQuestions.css";
import QuestionsTable from "./QuestionsTable";

const ManageQuestions = ({ mine }) => {
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
    <Container fluid className="home-container mt-5">
      <QuestionFollowUpModal
        show={showQuestionFollowUpModal}
        handleClose={() => setShowQuestionFollowUpModal(false)}
        question={question}
        saveAnswer={saveAnswer}
        mine={mine}
        setReloadPage={setReloadPage}
      />
      <Row className="justify-content-center mt-3">
        <Col id="questionsTable">
          <Card>
            <Card.Body>
              <h2 className="mb-1 ps-0">
                <strong>질문 목록</strong>
              </h2>
              <div className="justify-content-center align-items-center">
                <p className="text-center text-muted mb-4">
                  (총 {questionPage.totalElements} 건 중, 제 {indexOfFirst + 1}{" "}
                  ~ {Math.min(idxLastPlus1, questionPage.totalElements)}번 질문)
                </p>
              </div>
              <div
                id="questionTableDiv"
                style={{ whiteSpace: "initial", overflow: "auto" }}
                className="justify-content-center align-items-center"
              >
                {QuestionsTable(questions, answerQuestion)}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageQuestions;
