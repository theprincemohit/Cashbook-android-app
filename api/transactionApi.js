import fetchy from './axios';


// Fetch transaction profile
export const getTransactionByPassbookId = (passbookId) => {
  return fetchy.get('/transaction/', { params: {
        passbook_id: passbookId
    }});
};

// Update transaction profile
export const updateTransactionById = (transactionId, data) => {
  return fetchy.patch(`/transaction/${transactionId}`, data);
};

// Create a new transaction
export const createTransaction = (data) => {
  return fetchy.post('/transaction/', data);
};

// Delete a transaction
export const deleteTransactionById = (transactionId) => {
  return fetchy.delete(`/transaction/${transactionId}`);
};