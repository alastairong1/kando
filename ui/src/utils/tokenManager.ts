// Token management utility for Holo API authentication

// Token storage
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let accessTokenExpiry: number | null = null;
let refreshTokenExpiry: number | null = null;

// Helper function to get or refresh bearer token
const getBearerToken = async (): Promise<string> => {
  try {
    // TODO: Replace with actual API key
    const apiKey = 'YOUR_API_KEY_HERE';
    
    // Try to get a new token
    const response = await fetch('https://api.dev.holo.host/public/v1/auth/login-with-apikey', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Store both tokens with proper expiry
      cachedAccessToken = data.access_token;
      cachedRefreshToken = data.refresh_token;
      
      // TODO: Set proper access token expiry based on API response (placeholder: 1 hour)
      accessTokenExpiry = Date.now() + (60 * 60 * 1000);
      // Refresh token is valid for 30 days
      refreshTokenExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
      
      return data.access_token;
    } else {
      throw new Error(`Authentication failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error getting bearer token:', error);
    throw error;
  }
};

// Helper function to refresh bearer token
const refreshBearerToken = async (): Promise<string> => {
  try {
    if (!cachedAccessToken || !cachedRefreshToken) {
      throw new Error('No tokens available for refresh');
    }

    const response = await fetch('https://api.dev.holo.host/public/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: cachedAccessToken,
        refresh_token: cachedRefreshToken
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Store both new tokens with proper expiry
      cachedAccessToken = data.access_token;
      cachedRefreshToken = data.refresh_token;
      
      // TODO: Set proper access token expiry based on API response (placeholder: 1 hour)
      accessTokenExpiry = Date.now() + (60 * 60 * 1000);
      // Refresh token is valid for 30 days
      refreshTokenExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
      
      return data.access_token;
    } else {
      throw new Error(`Token refresh failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error refreshing bearer token:', error);
    throw error;
  }
};

// Get a valid token, refreshing if necessary
const getValidToken = async (): Promise<string> => {
  // Check if we have a cached access token that's still valid
  if (cachedAccessToken && accessTokenExpiry && Date.now() < accessTokenExpiry) {
    return cachedAccessToken;
  }

  // If we have tokens but access token might be expired, try to refresh if refresh token is still valid
  if (cachedRefreshToken && refreshTokenExpiry && Date.now() < refreshTokenExpiry) {
    try {
      const refreshedToken = await refreshBearerToken();
      return refreshedToken;
    } catch (error) {
      console.log('Token refresh failed, getting new token');
      // Clear invalid tokens
      clearTokens();
    }
  }

  // Get a new token if we don't have one or refresh failed
  const newToken = await getBearerToken();
  return newToken;
};

// Clear all cached tokens
const clearTokens = (): void => {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  accessTokenExpiry = null;
  refreshTokenExpiry = null;
};

// Helper function to make authenticated API calls with retry logic
export const makeAuthenticatedRequest = async (url: string, payload: any): Promise<Response> => {
  try {
    const token = await getValidToken();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // If we get a 401, the token might be expired - try once more with a fresh token
    if (response.status === 401) {
      console.log('Got 401, trying with fresh token');
      // Clear the cached tokens and get a fresh one
      clearTokens();
      const freshToken = await getValidToken();
      
      const retryResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      return retryResponse;
    }
    
    return response;
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
};

// Export other utility functions if needed
export { getValidToken, clearTokens }; 