from model.base import BaseDBModel
from typing import Optional
from pydantic import EmailStr

class User(BaseDBModel):
    username: Optional[str] = None
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    free_trial_count: int = 5 
    
    @classmethod
    async def by_id(cls, id: str):
        user = await cls.find_one({"_id": id})
        return user
    

    @classmethod
    async def by_email(cls, email: str):
        user = await cls.find_one({"email": email})
        return user
    
    @classmethod
    async def create(self, **kwargs):
        return await self.insert_one(**kwargs)
    
    @classmethod
    async def update(cls, instance_id, **kwargs):
        return await cls.update_one({'_id': instance_id}, kwargs)