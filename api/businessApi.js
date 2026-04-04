import fetchy from './axios';


// Fetch business profile
export const getBusinessById = (businessId) => {
  return fetchy.get(`/businesses/${businessId}`);
};


// Update business profile
export const updateBusinessById = (businessId, data) => {
  return fetchy.patch(`/businesses/${businessId}`, data);
};

// Fetch businesses for a user
export const getBusinesses = () => {
  return fetchy.get(`/businesses/`);
};

// Create a new business
export const createBusiness = (data) => {
  return fetchy.post('/businesses/', data);
};

// Create a first business
export const createFirstBusiness = (data) => {
  return fetchy.post('/businesses/create-first-business', data);
};

// Delete a business
export const deleteBusinessById = (businessId) => {
  return fetchy.delete(`/businesses/${businessId}`);
};