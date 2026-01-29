// Auth utility functions
export const getAccessToken = (): string | null => {
  // console.log('Getting access token from localStorage', localStorage.getItem('access_token'));
  return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

export const getUserInfo = (): any | null => {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
};




export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();

    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {},
  onUnauthorized?: () => void
): Promise<Response> => {
  let token = getAccessToken();

  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = getAccessToken();
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
    } else {
      // Refresh failed, trigger logout
      if (onUnauthorized) {
        onUnauthorized();
      }
    }
  }

  return response;
};