from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel
from core.config import settings
from model.user import User 


from typing import Optional
from fastapi import Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_403_FORBIDDEN

class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    def __init__(self, tokenUrl: str, cookie_name: str = "access_token"):
        super().__init__(tokenUrl=tokenUrl)
        self.cookie_name = cookie_name

    async def __call__(self, request: Request) -> Optional[str]:
        # Try to get the token from the Authorization header
        authorization: str = request.headers.get("Authorization")
        if authorization:
            scheme, _, param = authorization.partition(" ")
            if scheme.lower() == "bearer":
                print("param", param)
                return param

        # If no token found in the Authorization header, try to get it from the cookie
        token = request.cookies.get(self.cookie_name)
        print("cookie", token)
        if token:
            return token
        
        # If no token is found in either, raise an exception
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Not authenticated"
        )

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="login")
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
def get_password_hash(password):
    return pwd_context.hash(password)


class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    username: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(payload)
        email : str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
    except Exception:
        raise credentials_exception
    
    user_connection = await User.conn()
    user = user_connection.find_one({"email": email}, {"password": 0})
    print(type(user["_id"]))
    user["_id"] = str(user["_id"])
    return user
