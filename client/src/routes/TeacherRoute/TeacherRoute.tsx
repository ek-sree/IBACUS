import { Route, Routes } from "react-router-dom"
import DashboardPage from "../../pages/Teacher/DashboardPage"
import TaskPage from "../../pages/Teacher/TaskPage"
import StudentsPage from "../../pages/Teacher/StudentsPage"
import Signin from "../../components/Auth/Signin"
import { PublicRoute } from "./PublicRoute"
import { PrivateRoute } from "./PrivateRoute"
import ViewStudentAnswer from "../../components/Teacher/ViewStudentAnswer"
import ViewSingleTask from "../../components/Teacher/ViewSingleTask"

const TeacherRoute = () => {
  return (

    <Routes>
      <Route element={<PublicRoute/>}>
        <Route path="/signin" element={<Signin/>} />
      </Route>

      <Route element={<PrivateRoute/>}>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/tasks" element={<TaskPage/>} />
        <Route path="/user-lists" element={<StudentsPage/>} />
        <Route path="/view-task/:id" element={<ViewSingleTask/>} />
        <Route path="/view-answers/:id" element={<ViewStudentAnswer/>} />
      </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>

  )
}

export default TeacherRoute