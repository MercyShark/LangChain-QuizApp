import React from "react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { quizHistoryById } from "../api/quiz";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import html2pdf from "html2pdf.js";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import QuestionAnswer from "../components/QuestionAnswer";
function ShowQuizById() {
  const [showAllAnswer, setShowAllAnswer] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { quizId } = useParams<{ quizId: string }>();
  const [data, setData] = useState<{} | null>(null);
  const { user, setUser, logOut } = useAuth();
  console.log(user);
  useEffect(() => {
    quizHistoryById(quizId as string)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  
  const renderQuestions = (
    <Box>
    

      <Box display="flex" alignItems="center" justifyContent="space-between" marginX={2} marginY={3}>
        <Typography variant="h5">{data?.quiz.quiz_topic}</Typography>
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
        <Button onClick={() => setShowAllAnswer((prev) => !prev )} variant="outlined" endIcon={showAllAnswer ? <VisibilityOffIcon /> : <VisibilityIcon />}>{ showAllAnswer ? "Hide Answers" : "Show Answer"}</Button>
        </Box>
      </Box>

      <Box ref={contentRef}>
        <ol>
          {data?.quiz.questions.map((question, index) => (
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

  console.log(quizId);
  return <Box>{renderQuestions}</Box>;
}

export default ShowQuizById;
