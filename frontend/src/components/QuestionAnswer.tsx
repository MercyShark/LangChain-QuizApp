import { Button } from "@mui/material";
import { useEffect, useState } from "react";
const QuestionAnswer = ({ question , showAllAnswer = false}) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState<boolean>(false);

  useEffect(() => { 
    setIsAnswerVisible(showAllAnswer)
  },[showAllAnswer])

  console.log(isAnswerVisible, showAllAnswer)
  const toggleAnswerVisibility = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

//   const show
  return (
    <>
      <h3>{question.question}</h3>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <Button onClick={toggleAnswerVisibility}>{
        isAnswerVisible ? "Hide Answer" : "Show Answer" }</Button>
      { (isAnswerVisible)  && <h4>Answer: {question.answer} </h4>}
    </>
  );
};


export default QuestionAnswer;
