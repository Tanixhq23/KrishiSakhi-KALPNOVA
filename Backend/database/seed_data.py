from .mongo_connector import db

def seed():
    db.farmers.insert_one({"name": "Test Farmer"})
