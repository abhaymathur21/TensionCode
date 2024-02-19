# pandas package installation
!pip install pandas

# Sample Data Generation using pandas
import pandas as pd

# Sample data creation
data = {
    "name": ["Alice", "Bob", "Charlie"],
    "marks": [{"physics": 85, "chemistry": 90, "maths": 95},
              {"physics": 75, "chemistry": 80, "maths": 85},
              {"physics": 90, "chemistry": 95, "maths": 100}]
}
df = pd.DataFrame(data)

# Print sample data
print(df)

# Aggregation Pipeline Simulation
pipeline = [
    {
        '$group': {
            '_id': None,
            'physics': {
                '$push': '$marks.physics'
            },
            'chemistry': {
                '$push': '$marks.chemistry'
            },
            'maths': {
                '$push': '$marks.maths'
            }
        }
    },
    {
        '$project': {
            '_id': 0,
            'physics': {
                'min': {'$min': '$physics'},
                'max': {'$max': '$physics'},
                'mean': {'$avg': '$physics'}
            },
            'chemistry': {
                'min': {'$min': '$chemistry'},
                'max': {'$max': '$chemistry'},
                'mean': {'$avg': '$chemistry'}
            },
            'maths': {
                'min': {'$min': '$maths'},
                'max': {'$max': '$maths'},
                'mean': {'$avg': '$maths'}
            }
        }
    }
]

# Aggregate simulated data
result = df.agg({
    'marks.physics': ['min', 'max', 'mean'],
    'marks.chemistry': ['min', 'max', 'mean'],
    'marks.maths': ['min', 'max', 'mean']
})

print(result)