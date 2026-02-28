import fetchy from './axios';

// User login
export const login = (credentials) => {
  return fetchy.post('/login/', credentials);
};

// Register a new user
export const register = (data) => {
  return fetchy.post('/register/', data);
};