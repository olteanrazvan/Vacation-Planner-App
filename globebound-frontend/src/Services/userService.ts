import authService, { api } from './authService';

interface UserData {
    username: string;
    email: string;
    age: string;
    phone: string;
    userId: number;
}

const userService = {
    getUserProfile: async (): Promise<UserData> => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        const response = await api.get(`/content/users/${currentUser.userId}`);
        return response.data;
    },

    updateUserProfile: async (userData: Partial<UserData>): Promise<UserData> => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        const updateResponse = await api.put(`/content/users/${currentUser.userId}`, userData);
        return updateResponse.data;
    },

    deleteUserProfile: async (): Promise<void> => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        await api.delete(`/content/users/${currentUser.userId}`);
    }
};

export default userService;