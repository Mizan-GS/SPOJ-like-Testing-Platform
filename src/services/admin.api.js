import axiosClient from "./axiosClient";


 //*  QUESTIONS (ADMIN)


export const createQuestion = (data) =>
  axiosClient.post("/questions/admin", data);

export const getAllQuestions = (params = {}) =>
  axiosClient.get("/questions", { params });


export const getQuestionById = (id) =>
  axiosClient.get(`/questions/${id}`);

export const updateQuestion = (id, data) =>
  axiosClient.put(`/questions/admin/${id}`, data);

export const deleteQuestion = (id) =>
  axiosClient.delete(`/questions/admin/${id}`);

export const restoreQuestion = (id) =>
  axiosClient.patch(`/questions/admin/${id}/restore`);

export const getDeletedQuestions = (params = {})=>
  axiosClient.get("/questions/admin/deleted", {params});

//*   TESTS (ADMIN)


export const createTest = (data) =>
  axiosClient.post("/tests/admin", data);

export const getAllTests = () =>
  axiosClient.get("/tests/admin");

export const getTestById = (id) =>
  axiosClient.get(`/tests/${id}`);

export const updateTest = (id, data) =>
  axiosClient.put(`/tests/admin/${id}`, data);

export const deleteTest = (id) =>
  axiosClient.delete(`/tests/admin/${id}`);

export const restoreTest = (id) =>
  axiosClient.patch(`/tests/admin/${id}/restore`);

//* ANALYTICS (ADMIN)

export const getAdminOverviewAnalytics = () =>
  axiosClient.get("/analytics/admin/overview");

export const getTestAnalytics = () =>
  axiosClient.get("/analytics/admin/tests");

export const getUserAnalytics = () =>
  axiosClient.get("/analytics/admin/users");


//* ASSESSMENTS (ADMIN)

export const createAssessment = (data) =>
  axiosClient.post("/assessments/admin", data);

export const getAllAssessments = (params) =>
  axiosClient.get("/assessments", { params });

export const getAssessmentById = (id) =>
  axiosClient.get(`/assessments/${id}`);

export const updateAssessment = (id, data) =>
  axiosClient.put(`/assessments/admin/${id}`, data);

export const deleteAssessment = (id) =>
  axiosClient.delete(`/assessments/admin/${id}`);

export const restoreAssessment = (id) =>
  axiosClient.patch(`/assessments/admin/${id}/restore`);

export const getAssessmentQuestionHealth = (id) =>
  axiosClient.get(`/assessments/admin/${id}/question-health`);


