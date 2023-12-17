import { API_URLS } from "./constants.mjs";
import { fetchData } from "./api.mjs"; 

async function loginUser(email, password) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    };

    const result = await fetch(API_URLS.LOGIN, options);

    if (!result.ok) {
      if (result.status === 400 || result.status === 401) {
        const responseData = await result.json();
        console.error('Login error:', responseData.errors[0]);
        return { success: false, error: responseData.errors[0].message };
      }

      throw new Error('Login failed');
    }

    const { name, credits, avatar, accessToken } = await result.json();

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

    const result = await fetch(API_URLS.REGISTER, options);

    if (!result.ok) {
      if (result.status === 400) {
        const responseData = await result.json();
        return { success: false, error: responseData.errors[0].message };
      }

      throw new Error('Registration failed');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An error occurred during registration' };
  }
}

  export { registerUser };

  async function getUserProfile(accessToken, userName) {
    try {
      const profile = `${API_URLS.PROFILE}/${userName}`;
  
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      };
  
      const { success, data } = await fetchData(profile, options);
  
      if (!success) {
        throw new Error('Failed to fetch user profile');
      }
  
      return { success: true, userProfile: data };
    } catch (error) {
      console.error('User profile fetch error:', error);
      return { success: false, error: 'An error occurred while fetching user profile' };
    }
  }
  
  export { getUserProfile };