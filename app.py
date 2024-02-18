from flask import Flask, render_template, request, jsonify
import getpass
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import re
from flask_cors import CORS
from pathlib import Path
import google.generativeai as genai
import pandas as pd
import xml.etree.ElementTree as ET



if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDbzDwrQ3gi3kM-gA8XpmdXQWpRDG_xtEc"
    
genai.configure(api_key="AIzaSyB7fSw9N5yT6Rhhz1y6HMUC_bsjGp2YwkQ")

# Set up the model
generation_config = {
  "temperature": 0.4,
  "top_p": 1,
  "top_k": 32,
  "max_output_tokens": 4096,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

vision = genai.GenerativeModel(model_name="gemini-1.0-pro-vision-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

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
            {
                "mime_type": "image/png",
                "data": image.read()
            },
        ]
        prompt_parts = [
        image_parts[0],
        "\n i have this ER diagram and I want to extract the schema in json text format, also give me the data types of the columns in the schema. Also i want to know the data types for each column in the schema. So for that we have to assume and classify accordingly, for example if a column is of type varchar then we have to assume it as string, if it is of type int then we have to assume it as integer, if it is of type date then we have to assume it as date, if it is of type time then we have to assume it as time, if it is of type datetime then we have to assume it as datetime, if it is of type timestamp then we have to assume it as timestamp, if it is of type year then we have to assume it as year, if it is of type text then we have to assume it as text, if it is of type longtext then we have to assume it as longtext, if it is of type mediumtext then we have to assume it as mediumtext, if it is of type tinytext then we have to assume it as tinytext.",
        ]

        response = vision.generate_content(prompt_parts)

        print(response.text)
        schema=response.text
            
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
        
        result = llm.invoke(prompt)
        print(response.content)
        schema=response.content

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

    return jsonify({"generated_code": generated_code, "autogen_code": autogen_code})


async def autogen(generated_code):
    from autogen import config_list_from_json, UserProxyAgent, AssistantAgent

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
