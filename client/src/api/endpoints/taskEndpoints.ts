const BASE_URL = import.meta.env.VITE_API_URL;


export const TASKENDPOINTS = {
    ADD_TASK: `${BASE_URL}/task/add-task`,
    GET_TASKS: `${BASE_URL}/task/get-tasks`,
    DELETE_TASK: `${BASE_URL}/task/delete-task`,
};