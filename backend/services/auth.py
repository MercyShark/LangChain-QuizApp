from fastapi import APIRouter , Depends, status
from pydantic import BaseModel, EmailStr
from core.oauth import create_access_token,  get_current_user
from core.config import settings
from datetime import datetime, timedelta, timezone
from model.user import User
from pymongo.results import InsertOneResult
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from core.oauth import get_password_hash, verify_password

router = APIRouter(tags=['user'])

class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register_user(
    user : User,
):
    
    user_exist_record = await User.by_email(user.email)
    if user_exist_record: 
        raise HTTPException(detail="User already exists with this email",status_code=400)
    
    user.password = get_password_hash(user.password)
    user : InsertOneResult = await User.create(**user.dict())

    return JSONResponse(content={"message":"User created successfully"},status_code=201)

@router.post("/login")
async def login_for_access_token(
    user : UserLogin,
) -> Token:
    
    user_instance = await User.by_email(user.email)
    if user_instance is None or not verify_password(user.password, user_instance['password']):
        raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password",
             headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print(user_instance)
    await User.update(user_instance['_id'])
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(key="access_token", value=access_token, expires=access_token_expires, httponly=True, samesite="lax", secure=True)
    return response


@router.get("/users/me/")
async def read_users_me(
    current_user =  Depends(get_current_user),
):
    
    print(current_user)
    return current_user
