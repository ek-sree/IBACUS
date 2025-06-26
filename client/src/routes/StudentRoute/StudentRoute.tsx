import { Route, Routes } from "react-router-dom"
import Signin from "../../components/Auth/Signin"
import { PublicRoute } from "./PublicRoute"
import { PrivateRoute } from "./PrivateRoute"
import HomePage from "../../pages/Student/HomePage"
import AllTaskPage from "../../pages/Student/AllTaskPage"
import ViewAndAnswerTask from "../../components/User/ViewAndAnswerTask"
import PageNotFound from "../../common/components/PageNotFound"


const StudentRoute = () => {
  return (

    <Routes>
      <Route element={<PublicRoute/>}>
        <Route path="/signin" element={<Signin/>} />
      </Route>

      <Route element={<PrivateRoute/>}>
        <Route path="/" element={<HomePage/>} />
        <Route path="/all-tasks" element={<AllTaskPage/>} />
        <Route path="/view-and-answer-task/:id" element={<ViewAndAnswerTask/>} />
      </Route>
        <Route path="*" element={<PageNotFound />} />
    </Routes>

  )
}

export default StudentRoute