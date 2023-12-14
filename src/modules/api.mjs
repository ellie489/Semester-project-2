async function fetchData(API_endpoint, options = {}) {
  try {
    const response = await fetch(API_endpoint, options);

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { success: true, data };
    } else {

      return { success: true, data: null };
    }
  } catch (error) {
    console.error('Request error:', error);
    return { success: false, error: 'An error occurred during the request' };
  }
}

export { fetchData };
