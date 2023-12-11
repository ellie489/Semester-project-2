import { API_URLS } from "./constants.mjs";
import { fetchData } from "./api.mjs"; 

async function loginUser(username, password) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    const { success, data } = await fetchData(API_URLS.LOGIN, options);

    if (!success) {
      throw new Error('Login failed');
    }

    const { name, credits, avatar, accessToken } = data;

    localStorage.setItem('name', name);
    localStorage.setItem('credits', credits);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('accessToken', accessToken);

    return { success: true, userData: { name, credits, avatar, accessToken } };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export { loginUser };

async function registerUser(name, email, password, avatar) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, avatar }),
      };
  
      const { success, data } = await fetchData(API_URLS.REGISTER, options);
  
      if (!success) {
        throw new Error('Registration failed');
      }
  
      window.location.href = 'login.html';
  
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration' };
    }
  }
  
  export { registerUser };