/**
 * Get current user ID from authentication token or storage
 */
export function getUserId(): number | null {
  try {
    // Try to get from localStorage first
    const userId = localStorage.getItem('user_id');
    if (userId) {
      return parseInt(userId, 10);
    }

    // Try to get from JWT token (if stored as 'access_token')
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT payload (simple base64 decode)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.sub) {
            // Also save to localStorage for faster future access
            localStorage.setItem('user_id', String(payload.sub));
            return parseInt(payload.sub, 10);
          }
          if (payload.id) {
            localStorage.setItem('user_id', String(payload.id));
            return parseInt(payload.id, 10);
          }
          if (payload.user_id) {
            localStorage.setItem('user_id', String(payload.user_id));
            return parseInt(payload.user_id, 10);
          }
        } catch (e) {
          console.warn('Failed to decode JWT token:', e);
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}
