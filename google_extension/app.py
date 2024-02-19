from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# === Flask LLM Integration===

load_dotenv()


app = Flask(__name__)

client = OpenAI(api_key="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")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.data.decode('utf-8')
    print(prompt)
    # print(request)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "This is a serious code assistant designed to explain code thoroughly."},
            {"role": "user", "content": prompt}
        ]
       


    )
    output =  response.choices[0].message.content
    print(output)
    # return render_template('popup.html', prompt=prompt, output=output)
    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True)
