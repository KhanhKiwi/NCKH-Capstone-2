/**
 * Get userId from JWT token stored in localStorage
 */
export const getUserIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) return null;

    // Decode JWT (basic decoding without validation)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Try different field names (sub, user_id, userId, id)
    return payload.sub || payload.user_id || payload.userId || payload.id || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Save token and extract userId to localStorage
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
  
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
  } catch (error) {
    console.error('Failed to save userId:', error);
  }
};

/**
 * Get userId from localStorage or decode from token
 */
export const getUserId = (): number | null => {
  try {
    // First try to get from localStorage
    let userId = localStorage.getItem('userId');
    if (userId) {
      return parseInt(userId, 10);
    }
    
    // If not in localStorage, decode from token
    return getUserIdFromToken();
  } catch (error) {
    console.error('Failed to get userId:', error);
    return null;
  }
};

/**
 * Clear auth data from localStorage
 */
export const clearAuth = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};
