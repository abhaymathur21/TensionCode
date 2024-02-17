// Background script to handle communication
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'selectedText') {
    fetchMeaning(request.text, sendResponse);
    return true; // async response
  }
});

function fetchMeaning(text, callback) {
  fetch('http://127.0.0.1:5000/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: text  
  })
  .then(response => response.json())
  .then(data => {
    // callback(data.output);
    // Send output to popup.js
    chrome.runtime.sendMessage({action: 'displayMeaning', output: data.output});
    console.log(data.output);
  })
  .catch(error => {
    console.error('Error:', error);
    callback('Error fetching meaning.');
  });
}
