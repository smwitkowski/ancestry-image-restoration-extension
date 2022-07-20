// Function to render the image in the popup
const renderImage = (imageURL) => {
  document.getElementById("image").src = imageURL;
}

const resetImage = () => {
  document.getElementById("image").src = browser.runtime.getURL("assets/add-image.png");
}

// Listen for clicks and run the appropriate function.
function listenForClicks() {
  document.addEventListener("click", (e) => {

    // Render the image in the popup
    function getImageURL(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "getImageURL"
      }, renderImage);
    }

    // Log the error to the console
    function reportError(error) {
      console.error(`Could not render image: ${error}`);
    }

    // Get the active tab and call the appropriate function
    if (e.target.classList.contains("image")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(getImageURL)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({ active: true, currentWindow: true })
        .then(resetImage)
        .catch(reportError);
    }
  })
};

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({ file: "/content_scripts/process_image.js" })
  .then(resetImage)
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
