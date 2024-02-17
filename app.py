from flask import Flask, render_template, request, jsonify
import getpass
import os
from langchain_google_genai import ChatGoogleGenerativeAI
import re

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDbzDwrQ3gi3kM-gA8XpmdXQWpRDG_xtEc"
    
llm = ChatGoogleGenerativeAI(model="gemini-pro")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_code', methods=['POST'])
async def generate_code():
    
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
    # print(prompt)
    result = llm.invoke(prompt)
    generated_code = result.content
    print(generated_code)
    
    autogen_code = await autogen(generated_code)
    
    return jsonify({"generated_code": generated_code, "autogen_code":autogen_code})

async def autogen(generated_code):
    from autogen import config_list_from_json, UserProxyAgent, AssistantAgent

    config_list = config_list_from_json(
        env_or_file='OAI_CONFIG_LIST',
    )

    llm_config={"config_list": config_list}

    # User Proxy Agent
    user_proxy_agent = UserProxyAgent(
        name = "User_Proxy_Agent",
        code_execution_config={"work_dir": "coding", "use_docker": False},
        human_input_mode="NEVER",
        max_consecutive_auto_reply=5,
        is_termination_msg=lambda msg: "TERMINATE" in msg.get("content", ""),
    )
    # system_message=""" 
        
    #     If the code is correct and runs successfully, respond with the final corrected code inside 3 single quotes for example, and after that leave a line and write the word 'SUCCESS'."""
        
    # Assistant Agent
    assistant_agent = AssistantAgent(
        name = "Assistant_Agent",
        llm_config=llm_config,
        
    )
        # is_termination_msg=lambda msg: "SUCCESS" in msg.get("content", ""),   

    prompt = f'''
    You are a debugger agent.
    Generate sample data appropriate to the code and then run, test and debug the given code. 
    
    Given code: {generated_code}
    '''
    
    user_proxy_agent.initiate_chat(assistant_agent, message=prompt)
    await user_proxy_agent.a_send(
        f"""Based on the results in above conversation, please provide the final corrected code between ``` and ```.

        There is no need to use the word TERMINATE in this response.

        """,
        assistant_agent,
        request_reply=False,
        silent=True,
    )
    response = await assistant_agent.a_generate_reply(assistant_agent.chat_messages[user_proxy_agent], user_proxy_agent)
    await assistant_agent.a_send(response, user_proxy_agent, request_reply=False, silent=True)

    last_message = assistant_agent.chat_messages[user_proxy_agent][-1]["content"]
    print("last_Message: ",last_message)
    
    
    autogen_code = re.search(r"('''|```)(.*?)('''|```)", last_message, re.DOTALL).group(2)
    # start_index = last_message.find("```") + 3 # Adding 3 to exclude the triple quotes themselves
    # end_index = last_message.rfind("```")
    # autogen_code = last_message[start_index:end_index]
    print("autogen_code: ",autogen_code)
    return autogen_code

if __name__ == '__main__':
    app.run(debug=True)