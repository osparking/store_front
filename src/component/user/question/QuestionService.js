import { callWithToken } from "../../util/api";

export async function saveQuestion(data) {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await callWithToken("post", "/question/add", data);
    console.log("QuestionService: ", result.data);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getQuestionPage(page, size) {
  const urlPrefix = "/admin/all_questions?page=";

  try {
    const result = await callWithToken(
      "get",
      `${urlPrefix}${page}&size=${size}`
    );
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getQuestion(id) {
  const urlPrefix = "/question";

  try {
    const result = await callWithToken("get", `${urlPrefix}/${id}/read`);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function saveAnswerAct(answer) {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await callWithToken("post", "/question/follow_up", answer);
    console.log("답변/댓글 결과.data: ", result.data);
    return result.data;
  } catch (err) {
    throw err;
  }
}
