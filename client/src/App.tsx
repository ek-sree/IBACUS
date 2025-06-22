import { Route, Routes } from "react-router-dom"
import TeacherRoute from "./routes/TeacherRoute/TeacherRoute"
import { Toaster } from "sonner"
import StudentRoute from "./routes/StudentRoute/StudentRoute"

function App() {

  return (
    <>
              <Toaster richColors position="top-center"/>
      <Routes>

              <Route path="/*" element={<StudentRoute />} />
              <Route path="/teacher/*" element={<TeacherRoute />} />
      </Routes>
    </>
  )
}

export default App
