import os
from typing import List
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import status , APIRouter, Depends
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.output_parsers import JsonOutputParser
from model.history import QuizHistory
from model.user import User
from bson import ObjectId

from core.oauth import get_current_user
router = APIRouter(tags=['quiz'])
gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    temperature=0.3,
    google_api_key=os.getenv("gemini_google_api_key"),
)

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str


class Quiz(BaseModel):
    questions: List[Question]


parser = JsonOutputParser(pydantic_object=Quiz)

prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\nWrite an quiz on {quiz_topic} having {no_of_questions} questions and {no_of_options} options for each question and one answer of the question.\n",
    input_variables=["quiz_topic", "no_of_questions", "no_of_options"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)
chain = prompt | gemini_llm | parser

def get_questions(quiz_topic: str, no_of_questions: int, no_of_options: int) -> Quiz:
    return chain.invoke(
        {
            "quiz_topic": quiz_topic,
            "no_of_questions": no_of_questions,
            "no_of_options": no_of_options,
        }
    )


@router.get("/")
async def get_quiz(
    quiz_topic: str = "computer science",
    no_of_questions: int = 5,
    no_of_options: int = 4,
    current_user: dict =  Depends(get_current_user)
) -> JSONResponse:
    
    # print(current_user['free_trial_count'])
    if current_user['free_trial_count'] <= 0:
        raise HTTPException(detail={"message": "You have exhausted your free trial"}, status_code=status.HTTP_400_BAD_REQUEST)
    res = get_questions(quiz_topic, no_of_questions, no_of_options)
    data = {
        "quiz_topic": quiz_topic,
        "no_of_questions": len(res["questions"]),
        "questions": res["questions"],
    }

    await QuizHistory.create(user_id=ObjectId(current_user['_id']), quiz=data)
    await User.update_one({'_id': ObjectId(current_user['_id'])}, {'free_trial_count': current_user['free_trial_count']-1})
    return JSONResponse(content=data, status_code=status.HTTP_200_OK)


@router.get("/history")
async def get_quiz_history(current_user: dict =  Depends(get_current_user), only_names=False,) -> JSONResponse:
    history = await QuizHistory.find({"user_id": ObjectId(current_user['_id'])})
    data = []
    print(only_names)
    count = 1
    for h in history:
        data.append({
            "id" : count,
            "_id" : str(h["_id"]),
            "quiz": h["quiz"] if not only_names else h["quiz"]["quiz_topic"],
            "created_at": str(h["created_at"]),
            "updated_at": str(h["updated_at"])
        })
        count += 1
    main_data = {
        "total_quiz": len(data),
        # "user_id": str(current_user['_id']),
        "history": data
    }
    return JSONResponse(content=main_data, status_code=status.HTTP_200_OK)

@router.get("/history/{quiz_id}")
async def get_quiz_by_id(quiz_id: str, current_user: dict =  Depends(get_current_user)) -> JSONResponse:

    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(detail={"message": "Invalid quiz id"}, status_code=status.HTTP_400_BAD_REQUEST)
    
    history = await QuizHistory.find_one({"_id": ObjectId(quiz_id), "user_id": ObjectId(current_user['_id'])})
    if not history:
        raise HTTPException(detail={"message": "Quiz not found"}, status_code=status.HTTP_404_NOT_FOUND)
    data = {
        "_id" : str(history["_id"]),
        "quiz": history["quiz"],
        "created_at": str(history["created_at"]),
        "updated_at": str(history["updated_at"])
    }
    return JSONResponse(content=data, status_code=status.HTTP_200_OK)