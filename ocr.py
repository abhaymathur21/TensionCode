from pathlib import Path
import google.generativeai as genai

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

model = genai.GenerativeModel(model_name="gemini-1.0-pro-vision-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

# Validate that an image is present
if not (img := Path("ER-Model.png")).exists():
  raise FileNotFoundError(f"Could not find image: {img}")

image_parts = [
  {
    "mime_type": "image/png",
    "data": Path("ER-Model.png").read_bytes()
  },
]

prompt_parts = [
  image_parts[0],
  "\n i have this ER diagram and i want to extract the schema in json text format, also give me the data types of the columns in the schema. Aslo i want to know the data types for each column in the schema. So for that we have to assume and classify accordingly, for example if a column is of type varchar then we have to assume it as string, if it is of type int then we have to assume it as integer, if it is of type date then we have to assume it as date, if it is of type time then we have to assume it as time, if it is of type datetime then we have to assume it as datetime, if it is of type timestamp then we have to assume it as timestamp, if it is of type year then we have to assume it as year, if it is of type text then we have to assume it as text, if it is of type longtext then we have to assume it as longtext, if it is of type mediumtext then we have to assume it as mediumtext, if it is of type tinytext then we have to assume it as tinytext.",
]

response = model.generate_content(prompt_parts)

print(response.text)