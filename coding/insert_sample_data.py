# filename: insert_sample_data.py
import pymongo

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]
collection = db["students"]

# Sample data
sample_data = [
    { "_id": 1, "marks": { "physics": 85, "chemistry": 90, "maths": 95 }},
    { "_id": 2, "marks": { "physics": 75, "chemistry": 80, "maths": 85 }},
    { "_id": 3, "marks": { "physics": 90, "chemistry": 85, "maths": 80 }},
]

# Insert sample data into the collection
collection.insert_many(sample_data)

print("Sample data inserted into the 'students' collection.")