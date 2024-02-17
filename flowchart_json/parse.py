import openai
import json
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate




from langchain_openai import ChatOpenAI

model = ChatOpenAI(openai_api_key='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')
# Set up OpenAI API credentials

# Define the input code
code_input = '''
def linearSearch(array, n, x):

   
    for i in range(0, n):
        if (array[i] == x):
            return i
    return -1


array = [2, 4, 0, 1, 9]
x = 1
n = len(array)
result = linearSearch(array, n, x)
if(result == -1):
    print("Element not found")
else:
    print("Element found at index: ", result)
'''


prompt = '''
This is the input code: {input_code}

Use the above input code to generate a JSON text file that represents the flowchart of the code. The JSON text file should contain the flowchart in a structured format.
Use the following example only for reference to create the JSON text file for the input_code above:

'''

template = PromptTemplate(template=prompt, input_variables=['input_code'])


chain = template | model | StrOutputParser()

output = chain.invoke({'input_code': code_input})
print(output)

# # Generate the JSON text file
# def generate_json_file(code):
#     # Create a LangChain instance
#     lc = LangChain()

#     # Parse the code using LangChain
#     parsed_code = lc.parse(code)

#     # Convert the parsed code to JSON
#     json_code = json.dumps(parsed_code, indent=4)

#     # Write the JSON code to a file
#     with open('output.json', 'w') as file:
#         file.write(json_code)

# # Call the function with the input code
# generate_json_file(input_code)