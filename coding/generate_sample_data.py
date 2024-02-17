# filename: generate_sample_data.py

from pymongo import MongoClient

# Sample data for students
students_data = [
    {'name': 'Student 1', 'marks': {'physics': 85, 'chemistry': 90, 'maths': 92}},
    {'name': 'Student 2', 'marks': {'physics': 75, 'chemistry': 80, 'maths': 78}},
    {'name': 'Student 3', 'marks': {'physics': 65, 'chemistry': 70, 'maths': 68}}
]

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['test_db']
student_collection = db['students']

# Insert sample data into MongoDB collection
student_collection.insert_many(students_data)

print("Sample data inserted successfully.")