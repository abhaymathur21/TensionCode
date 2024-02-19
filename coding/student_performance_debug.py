# filename: student_performance_debug.py
import pymongo

# Sample data
sample_data = [
    {"marks": {"physics": 80, "chemistry": 75, "maths": 90}},
    {"marks": {"physics": 70, "chemistry": 85, "maths": 95}},
    {"marks": {"physics": 85, "chemistry": 80, "maths": 88}},
]

# Connect to the MongoDB database
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["testdb"]
collection = db["students"]
collection.insert_many(sample_data)

# Define and run the studentPerformance function
def studentPerformance():
    pipeline = [
        {
            "$group": {
                "_id": None,
                "physics": {
                    "min": { "$min": "$marks.physics" },
                    "max": { "$max": "$marks.physics" },
                    "mean": { "$avg": "$marks.physics" },
                },
                "chemistry": {
                    "min": { "$min": "$marks.chemistry" },
                    "max": { "$max": "$marks.chemistry" },
                    "mean": { "$avg": "$marks.chemistry" },
                },
                "maths": {
                    "min": { "$min": "$marks.maths" },
                    "max": { "$max": "$marks.maths" },
                    "mean": { "$avg": "$marks.maths" },
                },
            },
        },
    ]

    result = collection.aggregate(pipeline)
    return {"data": list(result)[0]}

# Execute the function and print the output
output = studentPerformance()
print(output)

# Drop the test collection after debugging
db.drop_collection("students")