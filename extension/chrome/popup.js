// Get the current active tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // Send a message to the content script to enhance the photo
  chrome.tabs.sendMessage(tabs[0].id, { action: 'enhancePhoto' });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'displayEnhancedPhoto') {
    displayEnhancedPhoto(message.enhancedUrl);
  }
});

// Function to display the enhanced photo in the popup
function displayEnhancedPhoto(enhancedUrl) {
  const photoContainer = document.getElementById('photoContainer');

  // Create an img element for the enhanced photo
  const enhancedPhoto = document.createElement('img');
  enhancedPhoto.src = enhancedUrl;
  enhancedPhoto.classList.add('enhanced-photo');

  // Create a div for the photo frame
  const photoFrame = document.createElement('div');
  photoFrame.classList.add('photo-frame');
  photoFrame.appendChild(enhancedPhoto);

  // Add the photo frame to the container
  photoContainer.appendChild(photoFrame);
}