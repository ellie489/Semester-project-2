import { API_URLS } from "./constants.mjs";
import { fetchData } from "./api.mjs";
async function deleteListing(listingId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = `${API_URLS.LISTINGS}/${listingId}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      const response = await fetchData(url, options);
  
      if (response.success) {
        console.log("Listing deleted successfully");
        return true;
      } else {
        console.error("Failed to delete listing:", response.error);
        return false;
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      return false;
    }
  }
  export { deleteListing };