import { api } from './authService';

export interface ModeratorRequest {
    modId: number;
    userId: number;
}

export interface UserManagementData {
    userId: number;
    username: string;
    email: string;
    age: number;
    phone: string;
    userType: string;
}

const moderatorService = {
    getAllUsers: async (): Promise<UserManagementData[]> => {
        const response = await api.get('/content/users');
        return response.data;
    },

    promoteToOwner: async (userId: number): Promise<void> => {
        const userResponse = await api.get(`/content/users/${userId}`);
        const ownerRequest = {
            user: userResponse.data
        };
        await api.post(`/owners`, ownerRequest);
    },

    deleteUser: async (userId: number): Promise<void> => {
        await api.delete(`/content/users/${userId}`);
    },

    promoteToModerator: async (userId: number): Promise<void> => {
        const request = {
            userId: userId
        };
        await api.post(`/moderators`, request);
    },
};

export default moderatorService;