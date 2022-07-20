(function () {

    // Function to print current url in the console.
    function printCurrentURL(tab) {
        console.log(tab.url);
    }

    // Function to get the image title
    function grabImageTitle() {
        let imageTitle = document.getElementsByClassName("mediaTitle ng-binding")[0]['innerText'];
        console.log(imageTitle);
    }


    // Function to grab the image source URL from the current tab.
    function grabImage() {
        console.log("grabImage()");
        let imageURL = document.querySelector('[src^="https://mediasvc.ancestry.com/v2/image/"]')['src'];
        console.log(imageURL);
    }

    // Listen for messages from the background script.
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "get_image_url") {
            grabImage();
        }
        else if (message.command === "get_url") {
            browser.tabs.query({ currentWindow: true, active: true }).then(printCurrentURL);
        }
        else if (message.command === "get_image_title") {
            grabImageTitle();
        }
    });

})();
