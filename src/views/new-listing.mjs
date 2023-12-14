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
    newListingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const title = document.getElementById("title").value;
      const deadline = document.getElementById("date").value;
      const image = document.getElementById("listing-image").value;
      const tags = document.getElementById("tags").value;
      const description = document.getElementById("description").value;

      const newListingData = {
        title,
        endsAt: deadline,
        media: [image],
        tags: tags.split(",").map((tag) => tag.trim()),
        description,
      };

      const { success, data } = await createNewListing(newListingData);

      if (success) {
        console.log("New listing created successfully:", data);
        console.log("SUCCESS!!");
      } else {
        console.error("Failed to create a new listing:", data.error);
      }
    });
  }
});
