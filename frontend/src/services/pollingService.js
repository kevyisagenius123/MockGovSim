import apiClient from '../api/apiClient';

export const applyForPollingFirm = (applicationData) => {
    return apiClient.post('/polling/firms', applicationData);
};

export const submitPoll = (pollData) => {
    return apiClient.post('/polling/polls/submit', pollData);
};

export const getMyFirm = () => {
    return apiClient.get('/polling/firms/my-firm');
};

export const getFirmById = (firmId) => {
    return apiClient.get(`/polling/firms/${firmId}`);
};

export const getAllFirms = () => {
    return apiClient.get('/polling/firms');
};

export const getPollsByFirm = (firmId) => {
    return apiClient.get(`/polling/polls/firm/${firmId}`);
}

const pollingService = {
    applyForPollingFirm,
    submitPoll,
    getMyFirm,
    getFirmById,
    getAllFirms,
    getPollsByFirm,
};

export default pollingService;