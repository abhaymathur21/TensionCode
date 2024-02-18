from openai import OpenAI

# Set up OpenAI API credentials
client = OpenAI(api_key="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")  # Replace with your actual OpenAI API key

# Define the input code
code_input = """
{
  "flowchart": {
    "start": {
      "next": "check_condition"
    },
    "check_condition": {
      "condition": "result == -1",
      "true": "print_message_not_found",
      "false": "print_message_found"
    },
    "print_message_not_found": {
      "message": "Element not found",
      "next": "end"
    },
    "print_message_found": {
      "message": "Element found at index: result",
      "next": "end"
    },
    "end": {}
  }
}
"""

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

# Define the prompt
prompt = f"""
This is the json format data for the flowchart to be created: {code_input}
This is the template code file that needs to be created as output: {temp_code}

Using the provided JSON data, please fill in the template code file with the appropriate code by replacing only the values of the flowchart to be generated.
Finally, print the code with the updated data.
"""

# Make the API call
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "system", "content": "You are a powerful flowchart generator. You can replace the data and provide me the code for flowchart generation. You have to provide me, I believe in you!"},
                    {"role": "user", "content": f"This is the data:\n{code_input}\n{temp_code}"}
                    ],
    # prompt=prompt,
    # max_tokens=500  # Adjust as needed
)

# Check if the output is empty, if so, print the original temp_code
print(response.choices[0].message.content )
    #   if response['choices'] else temp_code)
