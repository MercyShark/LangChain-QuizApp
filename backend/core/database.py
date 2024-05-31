from pymongo import MongoClient
import certifi
from core.config import settings

def connect():
    mongo_url = settings.DATABASE_URL 
    mongo_db =  settings.MONGO_INITDB_DATABASE
    client = MongoClient(mongo_url)
    db = client[mongo_db]
    return db


async def get_connection(collection : str):
    db = connect()
    conn = db[collection]
    return conn
