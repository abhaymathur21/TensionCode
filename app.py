from flask import Flask, render_template, request
import getpass
import os
from langchain_google_genai import ChatGoogleGenerativeAI

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDbzDwrQ3gi3kM-gA8XpmdXQWpRDG_xtEc"
    
llm = ChatGoogleGenerativeAI(model="gemini-pro")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_code', methods=['POST'])
def generate_code():
    
    data = request.get_json()
    language = data.get('language', 'python')
    function_template = data.get('function_template', "")
    input_params = data.get('input_params', "{}")
    output_format = data.get('output_format', "")
    provider = data.get('provider', "mongodb")
    schema = data.get('schema', "")
    task = data.get('task', "")
    
    prompt = [
    f"""
    You are a code generation system.
    Your job is to generate a complete function that performs the mentioned task.
    The function input is parsed as an JSON object
    The function output is sent as a JSON response.
    You have access to libraries and packages for the mentioned language and database.
    You can use the schema provided to generate the function.
    You have to ensure that the function is safe and secure to use.
    You have to ensure that the function is efficient and scalable.
    Use the function template provided to write the function.
    Use the input and output format provided to write the function.
    Add the necessary error handling and validation to the function.

    Language: {language}

    Function Template: {function_template}

    input =  {input_params}
    output =  {output_format}

    such that function(input) = output


    Database:
    Provider: {provider}
    Schema:
    {schema}

    Task: {task}

    Respond with only the function code.
    Response:
    """
    ]
    print(prompt)
    result = llm.invoke(prompt)
    print(result.content)
    
    return result.content

if __name__ == '__main__':
    app.run()