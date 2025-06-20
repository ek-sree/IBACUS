export const decodeJWT = (token: string): { id: string; role: string } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};