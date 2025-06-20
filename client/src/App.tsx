import { Route, Routes } from "react-router-dom"
import TeacherRoute from "./routes/TeacherRoute/TeacherRoute"
import { Toaster } from "sonner"

function App() {

  return (
    <>
              <Toaster richColors position="top-center"/>
      <Routes>

              {/* <Route path="/*" element={<UserRoute />} /> */}
              <Route path="/teacher/*" element={<TeacherRoute />} />
      </Routes>
    </>
  )
}

export default App
