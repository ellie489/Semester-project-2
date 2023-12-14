import { API_URLS } from "../modules/constants.mjs";
import { fetchData } from "../modules/api.mjs";

async function createNewListing(newListingData) {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newListingData),
    };

    const { success, data } = await fetchData(API_URLS.LISTINGS, options);

    return {
      success,
      data,
    };
  } catch (error) {
    console.error("Error creating a new listing:", error);
    return {
      success: false,
      data: { error: "Failed to create a new listing" },
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const newListingForm = document.getElementById("new-listing-form");
  
    if (newListingForm) {
      const imageContainer = document.getElementById("image-container");
      const addImageButton = document.getElementById("add-image");
      addImageButton.addEventListener("click", function () {

        const newImageInput = document.createElement("div");
        newImageInput.classList.add("my-3",  "pb-0");
      
        const label = document.createElement("label");
        label.setAttribute("for", "listing-image");
        label.classList.add("mb-1", "mx-1");
        label.textContent = "Image URL";
      
        const inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
      
        const input = document.createElement("input");
        input.setAttribute("type", "url");
        input.classList.add("form-control"); 
        input.setAttribute("aria-label", "listing image url");
        input.setAttribute("aria-describedby", "image");
      
        const removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.classList.add("btn", "btn-primary", "remove-image");
        removeButton.textContent = "-";
      
  
        inputGroup.appendChild(input);
        inputGroup.appendChild(removeButton);
      
        newImageInput.appendChild(label);
        newImageInput.appendChild(inputGroup);
      
    
        imageContainer.appendChild(newImageInput);
      
   
        removeButton.addEventListener("click", function () {
          imageContainer.removeChild(newImageInput);
        });
      });
  
      newListingForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const title = document.getElementById("title").value;
        const deadline = document.getElementById("date").value;
        const description = document.getElementById("description").value;
  
      
        const imageInputs = document.querySelectorAll(".form-control[aria-label='listing image url']");
        const media = Array.from(imageInputs).map((input) => input.value);
  
        const tags = document.getElementById("tags").value.split(",").map((tag) => tag.trim());
  
        const newListingData = {
          title,
          endsAt: deadline,
          media,
          tags,
          description,
        };
  
        const { success, data } = await createNewListing(newListingData);
  
        if (success) {
          console.log("New listing created successfully:", data);
        } else {
          console.error("Failed to create a new listing:", data.error);
        }
      });
    }
  });
  