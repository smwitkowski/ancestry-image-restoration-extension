// Function to render the image in the popup
const renderImage = (imageURL) => {
  document.getElementById("original-image").src = imageURL;
}

const resetImage = () => {
  document.getElementById("original-image").src = browser.runtime.getURL("assets/add-image.png");
  document.getElementById("restored-image").src = browser.runtime.getURL("assets/add-image.png");
}

async function restoreImage(url = 'https://3q76rbwfq3yqqlwsbppnytdcq40ynyzf.lambda-url.us-east-1.on.aws/') {
  document.getElementById("restored-image").classList.add("hidden");
  document.getElementById("loader-container").classList.remove("hidden");

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': '*',
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type"
    },
    body: JSON.stringify({
      image_url: document.getElementById("original-image").src,
      model_selection: "GPFGAN v1.3",
      upscale_factor: "2",
      channel_multiplier: "2"
    })
  })

  response.json().then((data) => { document.getElementById("restored-image").src = data['asset_url']; });

  document.getElementById("restored-image").classList.remove("hidden");
  document.getElementById("loader-container").classList.add("hidden");
}
// Restore the selected image

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
    } else if (e.target.classList.contains("restore")) {
      restoreImage();
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
