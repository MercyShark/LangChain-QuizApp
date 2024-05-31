import {
} from "react-router-dom";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Routes 
  } from "react-router-dom";
  
import ShowQuizById from "../page/ShowQuizByIdPage";
import CreateQuizPage from "../page/CreateQuizPage";
import QuizHistory from "../page/QuizHistory";
import SignIn from "../page/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import NotAuthenticated from "../components/NotAuthenticated";
import SignUp from "../page/ReigsterPage";
import Layout from "../page/RootElement";
const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route>
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<CreateQuizPage /> }/>
        <Route path="/quiz/" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
        <Route path="/quiz/:quizId"  element={<ProtectedRoute><ShowQuizById /></ProtectedRoute>} />
        </Route>
        <Route path="/login" element={ <NotAuthenticated><SignIn/> </NotAuthenticated>} />
        <Route path="/signup" element={ <SignUp/>} />
        <Route path="*" element={<div>404 Template</div>} />
      </Route>
      </>
    )
  );
export default router;