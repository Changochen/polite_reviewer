// This code will store the last selected text in local storage.
document.addEventListener('mouseup', function(event) {
  let selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    try {
      // Store the selected text in local storage
      chrome.storage.local.set({"selectedText": selectedText});
    } catch (error) {
      console.error('Error:', error);
    }
  }
});