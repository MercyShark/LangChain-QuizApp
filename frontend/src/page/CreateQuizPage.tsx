import { response } from "../constants";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useRef } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import html2pdf from "html2pdf.js";
import QuestionAnswer from "../components/QuestionAnswer";
import { createQuiz } from "../api/quiz";
import LoadingButton from "../components/form/LoadingButton";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
function CreateQuizPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{} | null>(response);
  const { register , formState, handleSubmit} = useForm();
  const [quizTopic, setQuizTopic] = useState<string>("");
  const [noOfQuestions, setNoOfQuestions] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllAnswer, setShowAllAnswer] = useState<boolean>(false);

  // const [ noOfOptions, setNoOfOptions] = useState<number>();

  const handleFormSubmit = (data) => {
    const { quiz_topic, no_of_questions } = data;
    setIsLoading(true);
    createQuiz(quiz_topic, no_of_questions)
      .then((response) => {
        setData(response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };


  const renderQuestions = (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginX={2}
        marginY={3}
      >
        <Typography variant="h5">{data?.quiz_topic}</Typography>
        <Box>
          <Button
            sx={{ marginRight: 2 }}
            type="button"
            onClick={() => {
              const element = contentRef.current;
              html2pdf(element);
            }}
            variant="outlined"
            endIcon={<CloudDownloadIcon />}
          >
            Export As PDF
          </Button>
          <Button
            onClick={() => setShowAllAnswer((prev) => !prev)}
            variant="outlined"
            endIcon={showAllAnswer ? <VisibilityOffIcon /> : <VisibilityIcon />}
          >
            {showAllAnswer ? "Hide Answers" : "Show Answer"}
          </Button>
        </Box>
      </Box>

      <Box ref={contentRef}>
        <ol>
          {data?.questions.map((question, index) => (
            <li key={index}>
              <QuestionAnswer
                question={question}
                showAllAnswer={showAllAnswer}
              />
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <Box display="flex" alignItems="center" justifyContent="space-between" marginX={2} marginTop={2}>
          <Box
            display="flex"
            alignItems="center"
            width="80%"
          >
            <TextField
              fullWidth
              variant="standard"
              label="Enter the Quiz Topic"
              {...register("quiz_topic", { required: "Quiz Topic is required" })}
              helperText={formState.errors.quiz_topic?.message}
              error={!!formState.errors.quiz_topic}
              size="small"
              sx={{
                marginRight: 4,
              }}
            />
            <TextField
              fullWidth
              type="number"
              variant="standard"
              {...register("no_of_questions", { required: "Number of questions is required" , validate : (value) => value > 0 && value <=30  || "Number of questions should be greater than 1 and less than 30"})}
              helperText={formState.errors.no_of_questions?.message}
              error={!!formState.errors.no_of_questions}
              label="Enter the number of questions"
              size="small"
              onChange={(e) => setNoOfQuestions(Number(e.target.value))}
            />
          </Box>
          <LoadingButton
            type="submit"
            variant="outlined"
            isLoading={isLoading}
            sx={{
              marginTop: 1,
            }}
          >
            {" "}
            Generate Quiz
          </LoadingButton>
        </Box>
      </Box>
      {data && renderQuestions}
    </>
  );
}

export default CreateQuizPage;
