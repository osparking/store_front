import { callWithToken } from "../../util/api";

export async function saveQuestion(data) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await callWithToken("post", "/question/add", data);
    console.log("QuestionService: ", result.data);
    return result.data;
  } catch (err) {
    throw err;
  }
}
