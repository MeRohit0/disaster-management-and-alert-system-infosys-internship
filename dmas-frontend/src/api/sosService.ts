import axios from 'axios';
import type { HelpRequestDTO, UserDTO } from '../types/helpRequest';

const API_BASE_URL = 'http://localhost:8080/api';

// 1. Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// 2. Add a Request Interceptor to attach the JWT
api.interceptors.request.use(
    (config) => {
        // Retrieve token from localStorage (where you likely saved it during login)
        const token = localStorage.getItem('token'); 
        
        if (token) {
            // Attach token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const sosService = {
    // CITIZEN: Send SOS
    sendSOS: async (data: HelpRequestDTO): Promise<HelpRequestDTO> => {
        // Use the 'api' instance instead of 'axios'
        const response = await api.post('/help/sos', data);
        return response.data;
    },

    // ADMIN: Get all pending help calls
    getPendingRequests: async (): Promise<HelpRequestDTO[]> => {
        const response = await api.get('/help/pending');
        return response.data;
    },

    // ADMIN: Get suggested responders for a specific request
    getSuggestedResponders: async (requestId: number): Promise<UserDTO[]> => {
        const response = await api.get(`/help/${requestId}/suggested-responders`);
        return response.data;
    },

    // ADMIN: Assign a responder
    assignResponder: async (requestId: number, responderId: number): Promise<HelpRequestDTO> => {
        const response = await api.put(`/help/${requestId}/assign/${responderId}`);
        return response.data;
    },

    // RESPONDER: Get tasks
    getTasksByResponder: async (responderId: number): Promise<HelpRequestDTO[]> => {
        const response = await api.get(`/help/responder/${responderId}`);
        return response.data;
    },

    // RESPONDER: Acknowledge
    acknowledgeTask: async (requestId: number): Promise<HelpRequestDTO> => {
        const response = await api.put(`/help/${requestId}/acknowledge`);
        return response.data;
    },

    // Fetch all responders for the Admin dropdown
    getAvailableResponders: async (): Promise<UserDTO[]> => {
        const response = await api.get('/help/responders');
        return response.data;
    },

    updateRequestStatus: async (requestId: number, status: string): Promise<HelpRequestDTO> => {
    // You can create a new endpoint for this or reuse a generic one
        const response = await api.put(`/help/${requestId}/status`, { status });
        return response.data;
    },

    // Module 4: Submit a Progress Update / Manual Report
    submitReport: async (reportData: any) => {
        const response = await api.post(`/reports/add`, reportData);
        return response.data;
    },

    // Module 4: Fetch the Timeline for Admin
    getTimeline: async (requestId: number) => {
        const response = await api.get(`/reports/timeline/${requestId}`);
        return response.data;
    },

    // Get Assigned Tasks for the Responder
    getResponderTasks: async (responderId: number) => {
        const response = await api.get(`/help/responder/${responderId}`);
        return response.data;
    },

    // 3. Update the Status of an SOS (and ideally trigger a report)
    updateStatus: async (requestId: number, status: string) => {
        const response = await api.put(`/help/${requestId}/status`, { status });
        return response.data;
    },
    async getAllHelpRequests() {
        try {
            const response = await api.get('help/all'); // Ensure this matches your @RequestMapping
            return response.data;
        } catch (error) {
            console.error("Error fetching all help requests:", error);
            throw error;
        }
},
};