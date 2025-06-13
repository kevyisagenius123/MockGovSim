import apiClientPublic from './apiClientPublic';

const resultsApi = {
    getNationalResults() {
        return apiClientPublic.get('/results/national');
    },

    getDetailedStateResults(stateCode) {
        return apiClientPublic.get(`/results/state/${stateCode}`);
    },

    getCountyResults(stateCode) {
        return apiClientPublic.get(`/results/state/${stateCode}/counties`);
    }
};

export default resultsApi; 