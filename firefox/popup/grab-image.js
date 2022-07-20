
function listenForClicks() {
    document.addEventListener("click", (e) => {

        // Send a message to the background script to get the image URL.
        function getImageURL(tabs) {
            browser.tabs.sendMessage(tabs[0].id, { command: "get_image_url" });
        }

        // Log errors into the console
        function reportError(error) {
            console.log(`Error: ${error}`);
        }

        if (e.target.classList.contains('action')) {
            browser.tabs.query({ currentWindow: true, active: true })
                .then(getImageURL).catch(reportError)
                .catch(reportError);
        }
    })
};

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs.executeScript({
    file: "/content_scripts/gather_url.js"
}).then(listenForClicks).catch(reportExecuteScriptError);