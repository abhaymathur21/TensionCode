import getpass
import json
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

import google.generativeai as genai
import openai
import pandas as pd
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv('.env')
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


parser_model = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY
)

# Set up OpenAI API credentials
client = OpenAI(
    api_key=OPENAI_API_KEY
)  # Replace with your actual OpenAI API key
# Define the template code
temp_code = """
import React, { useCallback, useState } from "react";
import Flowchart from "flowchart-react";
import { ConnectionData, NodeData } from "flowchart-react/schema";

const App = () => {
  // ... (Your existing template code here)

  return (
    <Flowchart
      showToolbar={["start-end", "operation", "decision"]}
      onChange={(nodes, connections) => {
        setNodes(nodes);
        setConns(connections);
      }}
      onDoubleClick={handleCreateNode}
      style={{ width: 800, height: 600 }}
      nodes={nodes}
      connections={conns}
    />
  );
};

export default App;
"""


if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)

# Set up the model
generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 4096,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
]

vision = genai.GenerativeModel(
    model_name="gemini-1.0-pro-vision-latest",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

llm = ChatGoogleGenerativeAI(model="gemini-pro")

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate_code", methods=["POST"])
async def generate_code():

    language = request.form.get("language", "python")
    function_template = request.form.get("function_template", "")
    input_params = request.form.get("input_params", "{}")
    output_format = request.form.get("output_format", "")
    provider = request.form["provider"] if "provider" in request.form else ""
    schema = request.form.get("schema", "")
    task = request.form.get("task", "")
    schema_format = request.form.get("schema_format", "")

    if schema_format == "image":

        image = request.files.get("image", None)
        # Abhay here you can use the image to get the schema

        # # Validate that an image is present
        # if not (img := Path("ER-Model.png")).exists():
        #     raise FileNotFoundError(f"Could not find image: {img}")

        image_parts = [
            {"mime_type": "image/png", "data": image.read()},
        ]
        prompt_parts = [
            image_parts[0],
            "\n i have this ER diagram and I want to extract the schema in json text format, also give me the data types of the columns in the schema. Also i want to know the data types for each column in the schema. So for that we have to assume and classify accordingly, for example if a column is of type varchar then we have to assume it as string, if it is of type int then we have to assume it as integer, if it is of type date then we have to assume it as date, if it is of type time then we have to assume it as time, if it is of type datetime then we have to assume it as datetime, if it is of type timestamp then we have to assume it as timestamp, if it is of type year then we have to assume it as year, if it is of type text then we have to assume it as text, if it is of type longtext then we have to assume it as longtext, if it is of type mediumtext then we have to assume it as mediumtext, if it is of type tinytext then we have to assume it as tinytext.",
        ]

        response = vision.generate_content(prompt_parts)

        print(response.text)
        schema = response.text

    elif schema_format == "table":
        table = request.files.get("table", None)
        filename = table.filename
        if filename.endswith(".csv"):
            df = pd.read_csv(table)
        elif filename.endswith(".json"):
            df = pd.read_json(table)
        elif filename.endswith(".xml"):
            # Read the XML file into a Pandas DataFrame
            root = ET.parse(table).getroot()
            data = []
            for item in root:
                data.append(item.attrib)
            df = pd.DataFrame(data)

        prompt = f""" 
        This is the data:\n{df.columns}\n{df.head()}
        Given the above dataframe data, I want to extract the schema in json text format, also give me the data types of the columns in the schema. Also i want to know the data types for each column in the schema. So for that we have to assume and classify accordingly, for example if a column is of type varchar then we have to assume it as string, if it is of type int then we have to assume it as integer, if it is of type date then we have to assume it as date, if it is of type time then we have to assume it as time, if it is of type datetime then we have to assume it as datetime, if it is of type timestamp then we have to assume it as timestamp, if it is of type year then we have to assume it as year, if it is of type text then we have to assume it as text, if it is of type longtext then we have to assume it as longtext, if it is of type mediumtext then we have to assume it as mediumtext, if it is of type tinytext then we have to assume it as tinytext.
        """

        response = llm.invoke(prompt)
        print(response.content)
        schema = response.content

    input_data = {
        "language": language,
        "function_template": function_template,
        "input_params": input_params,
        "output_format": output_format,
        "provider": provider,
        "schema": schema,
        "task": task,
    }

    prompt = [
        """
    You are a code generation system.
    Your job is to generate a complete function that performs the mentioned task.
    The function input is parsed as an JSON object
    The function output is sent as a JSON response.
    You have access to libraries and packages for the mentioned language and database but don't import any libraries that don't exist at all .
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

    template = PromptTemplate(
        template=prompt[0],
        input_variables=[
            "language",
            "function_template",
            "input_params",
            "output_format",
            "provider",
            "schema",
            "task",
        ],
    )

    chain = template | llm

    result = chain.invoke(input_data)
    generated_code = result.content
    print(generated_code)

    autogen_code = await autogen(generated_code)

    # parser for flowchart
    # parser_prompt = """
    # This is the input code: {input_code}

    # Use the above input code to generate a JSON text file that represents the flowchart of the code. The JSON text file should contain the flowchart in a structured format.
    # Use the following example only for reference to create the JSON text file for the input_code above:

    # """

    parser_prompt = """
    This is the input code: {input_code}

    Write a detailed flowchart code for each step in the input_code given above. Give the output flowchart code between ``` and ```. 
    Ensure that the flowchart code is in a structured format and is easy to understand.
    Ensure that the flowchart is in landscape mode and has small number of steps.
    Use the following flowchart codes as example output flowchart codes:

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

    """

    template = PromptTemplate(template=parser_prompt, input_variables=["input_code"])

    chain = template | parser_model | StrOutputParser()

    parsed_autogen_code = chain.invoke({"input_code": autogen_code})
    # print(output)

    # flowchart

    # response = client.chat.completions.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": "You are a powerful flowchart generator. You can replace the data and provide me the code for flowchart generation. You have to provide me, I believe in you!",
    #         },
    #         {
    #             "role": "user",
    #             "content": f"This is the data:\n{parsed_autogen_code}\n{temp_code}",
    #         },
    #     ],
    #     # prompt=prompt,
    #     # prompt=prompt,
    #     # max_tokens=500  # Adjust as needed
    # )

    # Check if the output is empty, if so, print the original temp_code
    # print(response.choices[0].message.content )
    #   if response['choices'] else temp_code)

    return jsonify(
        {
            "generated_code": generated_code,
            "autogen_code": autogen_code,
            # "flowchart_code": response.choices[0].message.content,
            "flowchart_code": parsed_autogen_code,
        }
    )


async def autogen(generated_code):
    from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

    config_list = config_list_from_json(
        env_or_file="OAI_CONFIG_LIST",
    )

    llm_config = {"config_list": config_list}

    # User Proxy Agent
    user_proxy_agent = UserProxyAgent(
        name="User_Proxy_Agent",
        code_execution_config={"work_dir": "coding", "use_docker": False},
        human_input_mode="NEVER",
        max_consecutive_auto_reply=5,
        is_termination_msg=lambda msg: "TERMINATE" in msg.get("content", ""),
    )
    # system_message="""

    #     If the code is correct and runs successfully, respond with the final corrected code inside 3 single quotes for example, and after that leave a line and write the word 'SUCCESS'."""

    # Assistant Agent
    assistant_agent = AssistantAgent(
        name="Assistant_Agent",
        llm_config=llm_config,
    )
    # is_termination_msg=lambda msg: "SUCCESS" in msg.get("content", ""),

    prompt = f"""
    You are a debugger agent.
    Generate sample data appropriate to the code and then run, test and debug the given code. 
    
    Given code: {generated_code}
    """

    user_proxy_agent.initiate_chat(assistant_agent, message=prompt)
    await user_proxy_agent.a_send(
        f"""Based on the results in above conversation, please provide the final corrected code between ``` and ```.
        Only give the code and not any sample data or any other information.
        The code should be in the same language as the original code.
        The function should be safe and secure to use.
        The function should be the only output.

        There is no need to use the word TERMINATE in this response.

        """,
        assistant_agent,
        request_reply=False,
        silent=True,
    )
    response = await assistant_agent.a_generate_reply(
        assistant_agent.chat_messages[user_proxy_agent], user_proxy_agent
    )
    await assistant_agent.a_send(
        response, user_proxy_agent, request_reply=False, silent=True
    )

    last_message = assistant_agent.chat_messages[user_proxy_agent][-1]["content"]
    print("last_Message: ", last_message)

    autogen_code = re.search(
        r"('''|```)?(.*?)('''|```)", last_message, re.DOTALL
    ).group(2)
    # start_index = last_message.find("```") + 3 # Adding 3 to exclude the triple quotes themselves
    # end_index = last_message.rfind("```")
    # autogen_code = last_message[start_index:end_index]
    print("autogen_code: ", autogen_code)
    return autogen_code


if __name__ == "__main__":
    app.run(debug=True)
