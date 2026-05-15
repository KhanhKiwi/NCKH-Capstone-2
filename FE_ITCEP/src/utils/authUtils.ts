/**
 * Get current user ID from authentication token or storage
 */
export function getUserId(): number | null {
  try {
    // **PRIORITY 1**: Always decode JWT first to get the current user
    // This ensures we get the correct user even if localStorage is stale
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT payload (simple base64 decode)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          let userId = payload.sub ?? payload.id ?? payload.user_id;
          if (userId) {
            // Update localStorage with fresh user_id from JWT
            localStorage.setItem('user_id', String(userId));
            return parseInt(String(userId), 10);
          }
        } catch (e) {
          console.warn('Failed to decode JWT token:', e);
        }
      }
    }

    // **PRIORITY 2**: Fall back to localStorage only if no valid JWT
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return parseInt(userId, 10);
    }

    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}
