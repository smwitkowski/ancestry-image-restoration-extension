console.log("Content script loaded");

// Function to enhance the photo
function enhancePhoto(photoUrl) {
  console.log("enhancePhoto called with URL:", photoUrl);

  chrome.runtime.sendMessage(
    {
      action: "fetchData",
      url: "https://ancestry-restore-mvfdoowqfq-uc.a.run.app/process-image",
      data: { img: photoUrl },
    },
    (response) => {
      console.log("Response received from background:", response);

      const sidePanelInner = document.querySelector(".sidePanelInner");
      // Get the overlay container
      const overlayContainer = document.querySelector(".overlay-container");

      if (response.error) {
        console.error("Error enhancing photo:", response.error);
        return;
      }
      sidePanelInner.removeChild(overlayContainer);

      // Create and set properties for the enhanced photo11
      const enhancedPhoto = document.createElement("img");
      enhancedPhoto.src = response;
      enhancedPhoto.style.maxWidth = "90%"; // Adjust this to fit the side panel
      enhancedPhoto.style.marginTop = "10px";
      enhancedPhoto.classList.add("enhanced-photo");
      enhancedPhoto.onclick = () => window.open(response, "_blank");

      // Create and set properties for the download button
      const downloadButton = document.createElement("button");
      downloadButton.type = "button";
      downloadButton.className = "ancBtn sml ng-binding";
      downloadButton.style.backgroundColor = "#B8336A";
      downloadButton.style.marginTop = "10px";
      downloadButton.innerText = "Download Enhanced Photo";
      downloadButton.onclick = function () {
        const a = document.createElement("a");
        a.href = response;
        a.download = "enhanced-photo.jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      // Insert the enhanced photo and download button below the enhance button
      sidePanelInner.appendChild(enhancedPhoto);
      sidePanelInner.appendChild(downloadButton);
    }
  );
}

// Function to add the "Enhance Photo" button
function addEnhanceButtonAutomatically() {
  // Get the blurry photo element on the page
  // The className of the image is "mediaImg"

  const blurryPhoto = document.querySelector(".mediaWrapper .mediaImg");
  console.log("blurryPhoto:", blurryPhoto);

  // Get the div where class="sidePanelInner"
  const sidePanelInner = document.querySelector(".sidePanelInner");

  // Check if a blurry photo element and sidePanelInner div exist
  console.log("Checking for .mediaImg and .sidePanelInner...");

  if (blurryPhoto && sidePanelInner) {
    console.log("Found .mediaImg and .sidePanelInner!");
    // Add the "Enhance Photo" button
    const enhanceButton = document.createElement("button");

    enhanceButton.type = "button";
    // Make the color of the button #B8336A
    enhanceButton.className = "ancBtn sml ng-binding";
    enhanceButton.style.backgroundColor = "#B8336A";
    enhanceButton.innerText = "Enhance Photo";
    enhanceButton.style.marginTop = "10px";
    enhanceButton.addEventListener("click", function () {
      // Prepare the blurred image
      const blurredPhoto = document.createElement("img");
      blurredPhoto.src = blurryPhoto.src;
      blurredPhoto.classList.add("blur-effect");
      blurredPhoto.style.maxWidth = "90%";
      blurredPhoto.style.marginTop = "10px";

      // Create a container for the blurred image and overlay
      const overlayContainer = document.createElement("div");
      overlayContainer.classList.add("overlay-container");

      // Create the white overlay
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.style.opacity = 0.1;

      // Create the spinner
      const spinner = document.createElement("div");
      spinner.classList.add("spinner");

      // Append everything together
      overlayContainer.appendChild(blurredPhoto);
      overlayContainer.appendChild(overlay);
      overlayContainer.appendChild(spinner);

      const sidePanelInner = document.querySelector(".sidePanelInner");
      // Append the container below the enhance button
      sidePanelInner.appendChild(overlayContainer);
      enhancePhoto(blurryPhoto.src); // Call the enhancement function when button is clicked
    });

    // Add the "Enhance Photo" button within the sidePanelInner div
    sidePanelInner.appendChild(enhanceButton);
  }
}

function tryToAddButton() {
  const blurryPhoto = document.querySelector(".mediaImg");
  const sidePanelInner = document.querySelector(".sidePanelInner");

  // Wait until the blurry photo has a src attribute and the sidePanelInner div exists
  if (blurryPhoto && sidePanelInner) {
    addEnhanceButtonAutomatically();
  } else {
    // If the elements are not yet available, check again after 500ms
    setTimeout(tryToAddButton, 500);
  }
}

// Call the tryToAddButton function when the page loads
window.addEventListener("load", tryToAddButton);
