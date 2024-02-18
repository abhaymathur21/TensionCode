# filename: sample_data_generation.py

import random

# Generate sample data for student marks
sample_data = []

for _ in range(10):  # Generate data for 10 students
    student = {
        "marks": {
            "physics": random.randint(60, 100),  # Random marks between 60 and 100
            "chemistry": random.randint(50, 95),  # Random marks between 50 and 95
            "maths": random.randint(45, 90),  # Random marks between 45 and 90
        }
    }
    sample_data.append(student)

print(sample_data)