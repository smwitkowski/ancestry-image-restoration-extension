// Listen for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    
  // Check if the page finished loading
  if (changeInfo.status === 'complete') {
    // Send a message to the content script to add the "Enhance Photo" button
    chrome.tabs.sendMessage(tabId, { action: 'addEnhanceButton' });
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);

    if (request.action === 'fetchData') {
        console.log('Fetching data from', request.url, 'with data', request.data);
        fetch(request.url, {
            method: 'POST',
            body: JSON.stringify(request.data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => {
    console.error("Fetch error:", error);
    sendResponse({error: error.toString()});
});

        // Return true for asynchronous use of sendResponse
        return true;
    }
});