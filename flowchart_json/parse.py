import openai
import json
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv('.env')
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

model = ChatOpenAI(openai_api_key=OPENAI_API_KEY)
# Set up OpenAI API credentials

# Define the input code
code_input = '''
import pymongo

def studentPerformance(inputParams):
    
    # connect to mongodb
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["studentPerformance"]
    collection = db["student"]
    
    # calculate mean, min and max marks in each subject
    mean_marks = {}
    min_marks = {}
    max_marks = {}
    for subject in ["physics", "chemistry", "maths"]:
        marks = list(collection.distinct(subject))
        mean_marks[subject] = sum(marks) / len(marks)
        min_marks[subject] = min(marks)
        max_marks[subject] = max(marks)
    
    # prepare output data
    outputData = {
        "mean_marks": mean_marks,
        "min_marks": min_marks,
        "max_marks": max_marks
'''


# prompt = '''
# This is the input code: {input_code}

# Use the above input code to generate a JSON text file that represents the flowchart of the code. The JSON text file should contain the flowchart in a structured format.
# Use the following example only for reference to create the JSON text file for the input_code above:

# '''

prompt = '''
This is the input code: {input_code}

Write a detailed flowchart code for each step in the input_code given above. Give the output flowchart code between ``` and ```. Use the following flowchart codes as example output flowchart codes:

Example 1:
```
st0=>start: start a_pyflow_test
op1=>operation: do something
cond2=>condition: Yes or No?
io3=>inputoutput: output: something...
e5=>end: end a_pyflow_test
sub4=>subroutine: A Subroutine

st0->op1
op1->cond2
cond2->
cond2->
cond2(yes)->io3
io3->e5
cond2(no)->sub4
sub4(right)->op1
```
Example 2:
```
st3=>start: start foo
io5=>inputoutput: input: a, b
cond9=>condition: if a
sub13=>subroutine: print('a')
io34=>inputoutput: output:  (a + b)
e32=>end: end function return
cond18=>operation: print('b') while  i in range(3)

st3->io5
io5->cond9
cond9(yes)->sub13
sub13->io34
io34->e32
cond9(no)->cond18
cond18->io34
```
Example 3:
```
st3=>start: start g
io5=>inputoutput: input: self
sub8=>subroutine: print('g')
sub10=>subroutine: f(self)
e12=>end: end g

st3->io5
io5->sub8
sub8->sub10
sub10->e12
```

'''

template = PromptTemplate(template=prompt, input_variables=['input_code'])


chain = template | model | StrOutputParser()

output = chain.invoke({'input_code': code_input})
print(output)
