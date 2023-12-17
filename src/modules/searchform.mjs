import { API_URLS } from "./constants.mjs";
import { createListingElement } from "./listings.mjs";
import { openDetailsPage } from "./listings.mjs";
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const listingsContainer = document.getElementById("listings-outer-container");
  
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      performSearch();
    });
  
    searchButton.addEventListener("click", async () => {
      performSearch();
    });
  
    async function performSearch() {
      const searchTerm = searchInput.value.trim();

        const limit = 0;
        const offset = 10;

        const listings = await searchListings(searchTerm, limit, offset);

  
      if (searchTerm) {
        try {
          const listings = await searchListings(searchTerm);
          displayListings(listings, listingsContainer);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    }
  });
  
  async function searchListings(searchTerm, limit = 10, offset = 0) {
    const apiUrl = `${API_URLS.LISTINGS}?search=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}&_active=true`;
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const filteredListings = data.filter(listing =>
      ((listing.title && listing.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return filteredListings;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}
function displayListings(listings, container) {
    container.innerHTML = "";
  
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
  
      const listingElement = createListingElement(listing);
  
      if (listingElement) {
        const colDiv = document.createElement("div");
  
        if (i < 4) {
          colDiv.classList.add("col-6", "col-lg-3");
        } else if (i % 5 === 4) {
          colDiv.classList.add("col-12", "col-lg-6");
        } else {
          colDiv.classList.add("col-6", "col-lg-3");
        }
  
        colDiv.addEventListener("click", () => openDetailsPage(listing.id));
        colDiv.appendChild(listingElement);
        container.appendChild(colDiv);
      }
    }
  

    if (listings.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "No matches found.";
      container.appendChild(noResultsMessage);
    }
  }
