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
  const messageContainer = document.getElementById("message-container");
  const viewListingButton = document.getElementById("view-listing-button");
 

  viewListingButton.style.display="none";  
  if (newListingForm) {
    const imageContainer = document.getElementById("image-container");
    const addImageButton = document.getElementById("add-image");

    addImageButton.addEventListener("click", function () {
      const newImageInput = document.createElement("div");
      newImageInput.classList.add("my-3", "pb-0");

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
      removeButton.textContent = "Remove";

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

      const titleInput = document.getElementById("title");
      const deadlineInput = document.getElementById("date");
      const descriptionInput = document.getElementById("description");
      const imageInputs = document.querySelectorAll(".form-control[aria-label='listing image url']");

      if (!titleInput.value.trim()) {
        inputIsEmpty(titleInput);
      } else {
        inputIsFilled(titleInput);
      }

      if (!deadlineInput.value.trim()) {
        inputIsEmpty(deadlineInput);
      } else {
        inputIsFilled(deadlineInput);
      }
      if (Array.from(imageInputs).some((input) => !input.value.trim())) {
        handleImageInputs(imageInputs);
    } else {
        inputIsFilled(titleInput);
    }
    

      if (!descriptionInput.value.trim()) {
        inputIsEmpty(descriptionInput);
      } else {
        inputIsFilled(descriptionInput);
      }

      if (
        !titleInput.value.trim() ||
        !deadlineInput.value.trim() ||
        !descriptionInput.value.trim() ||
        Array.from(imageInputs).some((input) => !input.value.trim())
      ) {
        messageContainer.innerHTML =
          '<div class="alert alert-danger">Please fill out the required fields.</div>';
        return; 
      }

     
      messageContainer.innerHTML = "";


      const media = Array.from(imageInputs).map((input) => input.value);

      const tags = document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim());

      const newListingData = {
        title: titleInput.value.trim(),
        endsAt: deadlineInput.value.trim(),
        media,
        tags,
        description: descriptionInput.value.trim(),
      };

      const { success, data } = await createNewListing(newListingData);

      if (success) {
        console.log("New listing created successfully:", data);
        messageContainer.innerHTML =
          '<div class="alert alert-success">New listing created successfully!</div>';
        viewListingButton.style.display="block";
        viewListingButton.addEventListener("click", function () {
          openDetailsPage(data.id);
        });  
      } else {
        console.error("Failed to create a new listing:", data.error);
        messageContainer.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        viewListingButton.style.display="none";  
      }
    });
  }
});

function inputIsEmpty(inputField) {
  inputField.classList.add("is-invalid");
}

function inputIsFilled(inputField) {
  inputField.classList.remove("is-invalid");
}
function handleImageInputs(inputs) {
  inputs.forEach((input) => {
      if (input && input.classList) {
          input.classList.add("is-invalid");
      }
  });
}
  function openDetailsPage(listingId) {
    window.location.href = `/profile/listing-details.html?id=${listingId}`;
  }