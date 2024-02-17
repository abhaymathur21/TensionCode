// Content script to extract selected text
document.addEventListener('mouseup', function() {
  var selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({action: 'selectedText', text: selectedText});
  }
  console.log(selectedText);
});
