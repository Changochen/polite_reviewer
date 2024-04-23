// options.js
document.addEventListener('DOMContentLoaded', function() {
  // Load the saved API key and update the input field
  chrome.storage.sync.get('apiKey', function(data) {
    document.getElementById('apiKey').value = data.apiKey || '';
  });

  // Save the API key when the save button is clicked
  document.getElementById('save').addEventListener('click', function() {
    var apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({'apiKey': apiKey}, function() {
      console.log('API Key saved');
    });
  });
});
