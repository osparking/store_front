import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Paginator from "../common/Paginator";
import {
  getMyQuestionsPage,
  getQuestion,
  getQuestionPage,
  saveAnswerAct,
} from "../user/question/QuestionService";
import { getRecordRange } from "../util/utilities";
import "./ManageQuestions.css";
import QuestionFollowUpModal from "./QuestionFollowUpModal";
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
    <>
      <QuestionFollowUpModal
        show={showQuestionFollowUpModal}
        handleClose={() => setShowQuestionFollowUpModal(false)}
        question={question}
        saveAnswer={saveAnswer}
        mine={mine}
        setReloadPage={setReloadPage}
      />
    <div
      className="justify-content-center align-items-center"
      style={{ display: "flex", overflow: "auto", width: "100vw" }}
    >
          <Card className="tableCard" style={{ margin: "28px 0" }}>
            <Card.Body  style={{ width: "100%" }}>
              <h2 className="mb-1 ps-0">
                <strong>나의 질문</strong>
              </h2>
              <p className="text-center text-muted mt-3 mb-1">
                {getRecordRange(
                  questionPage,
                  indexOfFirst,
                  idxLastPlus1,
                  "질문",
                )}
              </p>
              <div
                id="questionTableDiv"
                style={{
                  whiteSpace: "initial",
                  overflow: "auto",
                }}
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
                  darkBackground="true"
                />
              )}
            </Card.Body>
          </Card>
        </div>
      {/* </div> */}
    </>
  );
};

export default ManageQuestions;
