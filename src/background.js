// background.js

// Variable to hold the data sent from contentScript
let contentScriptData = "";

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STORE_DATA") {
    // Store the data received from contentScript
    contentScriptData = message.data;
    console.log("Data stored in background script:", contentScriptData);
  }
  sendResponse({ status: "Data received", data: contentScriptData });
});

// Function to return the stored data
chrome.runtime.onMessage.addListener((message, sender, seendResponse) => {
  if (message.type === "GET_STORED_DATA") {
    // Return the stored data when requested
    sendResponse({ data: contentScriptData });
  }
});
