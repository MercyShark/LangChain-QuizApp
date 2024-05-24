import { response } from "./constants"
import { Box, Button, Stack, TextField , Typography} from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';
import  { useState , useRef} from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import html2pdf from 'html2pdf.js';
import QuestionAnswer from "./components/QuestionAnswer";
import LoadingButton from '@mui/lab/LoadingButton'; 
function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const testingRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{} | null >(response);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [ noOfQuestions, setNoOfQuestions] = useState<number>(2);
  const [ isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllAnswer, setShowAllAnswer] = useState<boolean>(false);
  // const [ noOfOptions, setNoOfOptions] = useState<number>();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    axios.get("http://localhost:8000/", {
      params: {
        quiz_topic: quizTopic,
        no_of_questions: noOfQuestions
      }
    }).then((response : AxiosResponse) => {
      setData(response.data)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleExport = () => {
    const element = contentRef.current;
    // console.log(element)
    html2pdf(element);
    // setShowAllAnswer(true);
    // html2pdf(contentRef.current).finally(() =>  setShowAllAnswer(false));
  };


  const renderQuestions =
  <Box ref={contentRef}>
    <Button onClick={() => setShowAllAnswer((prev) => !prev )}>{ showAllAnswer ? "Hide Answers" : "Show Answer"}</Button>
  <h2>{data?.quiz_topic}</h2>
  <ol>
    {data?.questions.map((question, index) => (
      <li key={index}>
        <QuestionAnswer question={question} showAllAnswer={showAllAnswer}/>
      </li>
    ))}
  </ol>
  </Box>


  return (
    <>
      <h1>Quiz App</h1> 
      <Box component="form" onSubmit={handleFormSubmit}>
        <Typography variant="h4">Create Quiz</Typography>
        <Stack  direction="row" spacing={2} alignItems="center">
        <Typography variant="h6">Enter the quiz topic:</Typography>
        <TextField
          variant="filled"
          label="Enter the quiz topic:"
          value={quizTopic}
          onChange={(e) => setQuizTopic(e.target.value)}
          size="small"
        />
        </Stack>
        <Stack  direction="row" spacing={2} alignItems="center">
        <Typography variant="h6">Enter the number of questions</Typography>
        <TextField
          type="number"
          variant="filled"
          label="Enter the number of questions"
          value={noOfQuestions || ''}
          inputProps={{ min: 1, max: 10 }}
          onChange={(e) => setNoOfQuestions(Number(e.target.value))} />
        </Stack>
      <Button type="button" onClick={handleExport} variant="contained">Export As PDF</Button>
      <Button type="submit" variant="contained" disabled={isLoading}> Generate Quiz</Button>
      </Box>
      <Box sx={{ display: 'flex' }}>

        { isLoading && <CircularProgress />}

        {/* <CircularProgress /> */}
     </Box>

      {data && renderQuestions}

    </>
  )
}

export default App
