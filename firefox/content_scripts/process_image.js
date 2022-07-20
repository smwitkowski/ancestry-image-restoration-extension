(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // Get the URL of the image on the page
  function getImageURL() {
    let imageURL = document.querySelector('[src^="https://mediasvc.ancestry.com/v2/image/"]')['src'];
    return imageURL;
  }

  // Remove the image in the popup
  function reset() {
    return browser.runtime.getURL("assets/add-image.png");
  };

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
   */
  browser.runtime.onMessage.addListener((message, sender, response) => {
    if (message.command == "getImageURL") {
      let imageURL = getImageURL();
      response(imageURL);
    } else if (message.command == "reset") {
      let imageURL = reset();
      response(imageURL);
    }
  });

})();
