export const getAccessTokenFromSession = (): string | null => {
    return sessionStorage.getItem('accessToken');
  };
  
  export const saveAccessTokenToSession = (token: string): void => {
    sessionStorage.setItem('accessToken', token);
  };
  
  export const removeAccessTokenFromSession = (): void => {
    sessionStorage.removeItem('accessToken');
  };