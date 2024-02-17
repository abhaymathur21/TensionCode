# filename: student_performance_stat.py

def studentPerformance(students_data):
    physics_marks = [student["marks"]["physics"] for student in students_data]
    chemistry_marks = [student["marks"]["chemistry"] for student in students_data]
    maths_marks = [student["marks"]["maths"] for student in students_data]

    outputData = {
        "physics": {
            "min": min(physics_marks),
            "max": max(physics_marks),
            "mean": round(sum(physics_marks) / len(physics_marks), 2)
        },
        "chemistry": {
            "min": min(chemistry_marks),
            "max": max(chemistry_marks),
            "mean": round(sum(chemistry_marks) / len(chemistry_marks), 2)
        },
        "maths": {
            "min": min(maths_marks),
            "max": max(maths_marks),
            "mean": round(sum(maths_marks) / len(maths_marks), 2)
        }
    }

    print(outputData)

    return {
        "data": outputData
    }

# Sample data to test the code
students = [
    {"marks": {"physics": 85, "chemistry": 90, "maths": 88}},
    {"marks": {"physics": 78, "chemistry": 85, "maths": 92}},
    {"marks": {"physics": 92, "chemistry": 88, "maths": 95}},
]

output = studentPerformance(students)