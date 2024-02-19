# filename: using_mongodb_atlas.py
import pymongo

# Connect to MongoDB Atlas (Replace <username>, <password>, and <cluster_url> with your MongoDB Atlas credentials)
client = pymongo.MongoClient("mongodb+srv://<username>:<password>@<cluster_url>/test?retryWrites=true&w=majority")
db = client.school
collection = db.students

# Insert sample data
data = [
    {"name": "Alice", "marks": {"physics": 85, "chemistry": 90, "maths": 88}},
    {"name": "Bob", "marks": {"physics": 75, "chemistry": 80, "maths": 82}},
    {"name": "Charlie", "marks": {"physics": 95, "chemistry": 92, "maths": 89}},
    {"name": "David", "marks": {"physics": 70, "chemistry": 75, "maths": 78}},
]

collection.insert_many(data)

# Test the function
def studentPerformance(inputParams):
    threshold = inputParams["threshold"]

    match_query = {
        "$match": {
            "marks.physics": {"$gte": threshold},
            "marks.chemistry": {"$gte": threshold},
            "marks.maths": {"$gte": threshold},
        }
    }

    project_query = {
        "$project": {
            "_id": 0,
            "name": 1,
            "mean_marks": {
                "$avg": [
                    "$marks.physics",
                    "$marks.chemistry",
                    "$marks.maths",
                ]
            },
        }
    }

    students = list(db.students.aggregate([match_query, project_query]))

    return {
        "data": students,
    }

# Test the function
inputParams = {"threshold": 80}
result = studentPerformance(inputParams)
print(result)