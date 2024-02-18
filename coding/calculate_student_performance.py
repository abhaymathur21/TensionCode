# filename: calculate_student_performance.py
import pymongo

# Generate sample data for students' marks
sample_data = [
    {"name": "Alice", "marks": {"physics": 80, "chemistry": 75, "maths": 90}},
    {"name": "Bob", "marks": {"physics": 70, "chemistry": 85, "maths": 95}},
    {"name": "Charlie", "marks": {"physics": 60, "chemistry": 80, "maths": 85}}
]

# Save the sample data to the database
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.school
db.students.insert_many(sample_data)

# Now, we can test the studentPerformance function
def studentPerformance(inputParams):
    # Get all the student marks
    marks = db.students.find({}, {"_id": 0, "marks": 1})

    # Initialize the output object
    output = {
        "physics": {
            "min": float("inf"),
            "max": float("-inf"),
            "mean": 0.0
        },
        "chemistry": {
            "min": float("inf"),
            "max": float("-inf"),
            "mean": 0.0
        },
        "maths": {
            "min": float("inf"),
            "max": float("-inf"),
            "mean": 0.0
        }
    }

    # Calculate the min, max and mean for each subject
    for mark in marks:
        for subject, value in mark["marks"].items():
            output[subject]["min"] = min(output[subject]["min"], value)
            output[subject]["max"] = max(output[subject]["max"], value)
            output[subject]["mean"] += value

    # Calculate the mean for each subject
    total_students = db.students.count()
    for subject in output:
        output[subject]["mean"] /= total_students

    # Return the output object
    return {
        "data": output,
    }

# Test the function with the sample data
result = studentPerformance({})

print(result)