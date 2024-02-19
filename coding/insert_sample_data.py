# filename: insert_sample_data.py
import pymongo

# Connect to the MongoDB instance
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.school

# Insert some sample data
students = db.students
data = [
    {"name": "Alice", "marks": {"physics": 80, "maths": 75, "chemistry": 85}},
    {"name": "Bob", "marks": {"physics": 70, "maths": 78, "chemistry": 72}},
    {"name": "Charlie", "marks": {"physics": 90, "maths": 85, "chemistry": 88}},
]
students.insert_many(data)