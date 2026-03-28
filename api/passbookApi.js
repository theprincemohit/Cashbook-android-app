import fetchy from './axios';


// Fetch passbook profile
export const getPassbookById = (businessId) => {
  return fetchy.get(`/passbook/${businessId}`);
};

// Update passbook profile
export const updatePassbookById = (businessId, passbookId, data) => {
  return fetchy.patch(`/passbook/${businessId}/${passbookId}`, data);
};

// Create a new passbook
export const createPassbook = (data) => {
  return fetchy.post('/passbook/', data);
};

// Delete a passbook
export const deletePassbookById = (businessId,passbookId) => {
  return fetchy.delete(`/passbook/${businessId}/${passbookId}`);
};