from model.base import BaseDBModel
from typing import Optional
from bson.objectid import ObjectId as BsonObjectId
from pydantic import EmailStr

class QuizHistory(BaseDBModel):
    user_id: BsonObjectId
    quiz: EmailStr
    class Config:
        arbitrary_types_allowed = True


    # @classmethod
    # async def by_id(cls, id: str):
    #     user = await cls.find_one({"_id": id})
    #     return user
    

    # @classmethod
    # async def by_email(cls, email: str):
    #     user = await cls.find_one({"email": email})
    #     return user
    
    @classmethod
    async def create(self, **kwargs):
        return await self.insert_one(**kwargs)
    
    # @classmethod
    # async def update(cls, instance_id, **kwargs):
    #     return await cls.update_one({'_id': instance_id}, kwargs)