import apiClient from './apiClient'; // Assuming apiClient handles auth headers

// Bill-related API calls
export const getBills = () => {
    return apiClient.get('/bills');
};

export const getBillById = (id) => {
    return apiClient.get(`/bills/${id}`);
};

export const createBill = (billData) => {
    return apiClient.post('/bills', billData);
};

export const updateBillStatus = (id, status) => {
    return apiClient.put(`/bills/${id}/status`, { status });
};

// Vote-related API calls
export const castVote = (billId, voteData) => {
    return apiClient.post(`/bills/${billId}/vote`, voteData);
};

// Speech-related API calls
export const getSpeeches = (billId) => {
    return apiClient.get(`/bills/${billId}/speeches`);
};

export const postSpeech = (billId, speechData) => {
    return apiClient.post(`/bills/${billId}/speeches`, speechData);
};

// Amendment-related API calls
export const getAmendmentsForBill = (billId) => {
    return apiClient.get(`/amendments/bill/${billId}`);
};

export const createAmendment = (amendmentData) => {
    return apiClient.post('/amendments', amendmentData);
};

export const updateAmendmentStatus = (amendmentId, status) => {
    return apiClient.put(`/amendments/${amendmentId}/status`, { status });
};

// Pledged Vote-related API calls
export const getPledgedVotesForBill = (billId) => {
    return apiClient.get(`/pledges/bill/${billId}`);
};

export const addPledgedVote = (pledgeData) => {
    return apiClient.post('/pledges', pledgeData);
};

export const getWhipBreakdown = (billId) => {
    return apiClient.get(`/pledges/bill/${billId}/whip-breakdown`);
};

export const getLatestBill = () => {
    return apiClient.get('/bills/latest');
}; 