document.addEventListener('DOMContentLoaded', function() {
    var findMeaningButton = document.getElementById('findMeaningButton');
  
    // Add click event listener to the button
    findMeaningButton.addEventListener('click', function() {
      // Send a message to the background script to initiate finding the meaning
      chrome.runtime.sendMessage({action: 'findMeaning'}, function(response) {
        // Display the meaning returned by the background script
        document.getElementById('meaning').innerText = response;
        console.log(response);
      });
    });
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'displayMeaning') {
      // Display the meaning received from background script
      document.getElementById('meaning').innerText = request.output;
      console.log(request.output);
    }
  });
});