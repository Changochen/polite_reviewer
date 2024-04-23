// popup.js
function getSelectedText() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('selectedText', function (data) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(data.selectedText || '');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    const sendButton = document.getElementById('send');
    try {
        // Step 3: Use await before the function call that returns a Promise
        const selectedText = await getSelectedText();
        console.log('Data:', selectedText);
        document.getElementById('prompt').value = selectedText;
    } catch (error) {
        console.error('Could not get selected text: ', error);
    }

    const promptInput = document.getElementById('prompt');
    const responseContainer = document.getElementById('response');

    responseContainer.addEventListener('click', function () {
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(responseContainer.textContent).then(function () {
            console.log('Text copied to clipboard');
        }).catch(function (err) {
            console.error('Could not copy text: ', err);
        });
    });

    // Function to make the API call
    function callOpenAI(promptText, apiKey) {
        const data = {
            'model': 'gpt-3.5-turbo',
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful code review assistant. Refactor my code review so that it is more constructive, helpful, concise and polite. Use terms like \"We should\", \"Consider\""
                },
                {
                    "role": "user",
                    "content": promptText
                }
            ],
        };

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.error('Data:', data);
                responseContainer.textContent = data.choices[0].message.content;
            })
            .catch(error => {
                console.error('Error:', error);
                responseContainer.textContent = 'Error: Could not get a response from the API.';
            });
    }

    function handleClick() {
        const promptText = promptInput.value;

        // Retrieve the API key from storage and call the API
        chrome.storage.sync.get('apiKey', function handleStorageData(data) {
            const apiKey = data.apiKey;
            if (!apiKey) {
                responseContainer.textContent = 'Error: OpenAI API Key is not set. Please set it in the extension options.';
                return;
            }
            callOpenAI(promptText, apiKey);
        });
    }

    function handleClick2(text) {
        // Retrieve the API key from storage and call the API
        chrome.storage.sync.get('apiKey', function handleStorageData(data) {
            const apiKey = data.apiKey;
            if (!apiKey) {
                responseContainer.textContent = 'Error: OpenAI API Key is not set. Please set it in the extension options.';
                return;
            }
            callOpenAI(text, apiKey);
        });
    }
    // Event listener for the send button
    sendButton.addEventListener('click', handleClick);
    console.log("Today's date is " + new Date().toDateString());
    console.log("Prompt: " + promptInput.value);
    handleClick2(promptInput.value);
});
