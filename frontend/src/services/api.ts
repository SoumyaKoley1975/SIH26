import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/landslide';

export const api = {
    getDataStatus: async () => {
        const response = await axios.get(`${API_BASE_URL}/data-status`);
        return response.data;
    },
    getHazard: async (lat: number, lon: number) => {
        const response = await axios.get(`${API_BASE_URL}/hazard/${lat}/${lon}`);
        return response.data;
    },
    getSusceptibility: async (lat: number, lon: number) => {
        const response = await axios.get(`${API_BASE_URL}/susceptibility/${lat}/${lon}`);
        return response.data;
    },
    getTrigger: async (lat: number, lon: number) => {
        const response = await axios.get(`${API_BASE_URL}/trigger/${lat}/${lon}`);
        return response.data;
    }
};
