import os
import uvicorn
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
from typing import List
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  

load_dotenv()
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
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


class Photo(BaseModel):
    url: str
    caption: str

photo_parser = JsonOutputParser(pydantic_object=Photo)
parser = JsonOutputParser(pydantic_object=Quiz)
# code chain
prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\nWrite an quiz on {quiz_topic} having {no_of_questions} questions and {no_of_options} options for each question and one answer of the question.\n",
    input_variables=["quiz_topic", "no_of_questions", "no_of_options"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)
chain = prompt | gemini_llm | parser

photo_prompt = PromptTemplate(
    template="Generate an photo with caption.\n{format_instructions}\n on topic {photo_query} ...use pexels or splash api for generating pictures.\n",
    input_variables=["photo_query",],
    partial_variables={"format_instructions": photo_parser.get_format_instructions()},
)
# photo_prompt = PromptTemplate("Generate an photo with caption.\n{format_instructions}\n on topic {photo_query}", input_variables=["photo_query"], partial_variables={"format_instructions": photo_parser.get_format_instructions()})

photo_chain = photo_prompt | gemini_llm | photo_parser

@app.get("/photo")
def get_photo(photo_query: str) -> Photo:
    results =  photo_chain.invoke({"photo_query": photo_query})
    print(results)
    data = { 
        "url": results["url"],
        "caption": results["caption"]
    }
    return JSONResponse(content=data, status_code=status.HTTP_200_OK)
    # return results

def get_questions(quiz_topic: str, no_of_questions: int, no_of_options: int) -> Quiz:
    return chain.invoke(
        {
            "quiz_topic": quiz_topic,
            "no_of_questions": no_of_questions,
            "no_of_options": no_of_options,
        }
    )


@app.get("/")
def get_quiz(
    quiz_topic: str = "computer science",
    no_of_questions: int = 5,
    no_of_options: int = 4,
) -> JSONResponse:
    res = get_questions(quiz_topic, no_of_questions, no_of_options)
    data = {
        "quiz_topic": quiz_topic,
        "no_of_questions": len(res["questions"]),
        "questions": res["questions"],
    }
    return JSONResponse(content=data, status_code=status.HTTP_200_OK)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
