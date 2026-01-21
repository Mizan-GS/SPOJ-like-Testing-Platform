import axiosClient from "./axiosClient";


 //*  QUESTIONS (ADMIN)


export const createQuestion = (data) =>
  axiosClient.post("/questions", data);

export const getAllQuestions = () =>
  axiosClient.get("/questions");

export const getQuestionById = (id) =>
  axiosClient.get(`/questions/${id}`);

export const updateQuestion = (id, data) =>
  axiosClient.put(`/questions/${id}`, data);

export const deleteQuestion = (id) =>
  axiosClient.delete(`/questions/${id}`);

export const restoreQuestion = (id) =>
  axiosClient.patch(`/questions/${id}/restore`);

//*   TESTS (ADMIN)


export const createTest = (data) =>
  axiosClient.post("/tests", data);

export const getAllTests = () =>
  axiosClient.get("/tests");

export const getTestById = (id) =>
  axiosClient.get(`/tests/${id}`);

export const updateTest = (id, data) =>
  axiosClient.put(`/tests/${id}`, data);

export const deleteTest = (id) =>
  axiosClient.delete(`/tests/${id}`);

export const restoreTest = (id) =>
  axiosClient.patch(`/tests/${id}/restore`);


//*   RESULTS (ADMIN)


export const downloadResultPdf = (attemptId) =>
  axiosClient.get(`/results/${attemptId}/pdf`, {
    responseType: "blob",
  });
