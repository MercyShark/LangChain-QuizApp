from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from core.database import get_connection

class BaseDBModel(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    async def conn(cls):
        return await cls.get_connection()

    @classmethod
    async def get_connection(cls):
        return await get_connection(cls.__name__)

    @classmethod
    async def insert_one(cls, **data):
        data['created_at'] = datetime.now()
        data['updated_at'] = datetime.now()

        conn = await cls.get_connection()
        return conn.insert_one(data)    

    @classmethod
    async def insert_many(cls, data: list):
        for item in data:
            item['created_at'] = datetime.now()
            item['updated_at'] = datetime.now()

        conn = await cls.get_connection()
        return conn.insert_many(data)

    @classmethod
    async def update_one(cls, filters, update_data):
        update_data['updated_at'] = datetime.now()

        conn = await cls.get_connection()
        return conn.update_one(filters, {
            "$set": update_data
        })

    @classmethod
    async def update_many(cls, filters, update_data):
        update_data['updated_at'] = datetime.now()

        conn = await cls.get_connection()
        return conn.update_many(filters, {
            "$set": update_data
        })

    @classmethod
    async def find(cls, filters):
        conn = await cls.get_connection()
        return conn.find(filters)
    
    @classmethod
    async def find_one(cls,filters) -> dict:
        conn = await cls.get_connection()
        return conn.find_one(filters)

    @classmethod
    async def delete_one(cls, filters):
        conn = await cls.get_connection()
        return conn.delete_one(filters)

    @classmethod
    async def delete_many(cls, filters):
        conn = await cls.get_connection()
        return conn.delete_many(filters)

    @classmethod
    async def find_and_sort(cls,filters,sort_key,sort_direction=-1):
        result = await cls.find(filters)
        return result.sort(sort_key,sort_direction)
    
    @classmethod
    async def count(cls, filters):
        conn = await cls.get_connection()
        return conn.count_documents(filters)

