import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type UserRole = 'ROLE_USER' | 'ROLE_OWNER' | 'ROLE_MODERATOR';

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
    username: string;
    role: string;
    userId: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    age: string;
    phone: string;
}

interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'json'
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const isValidRole = (role: string): role is UserRole => {
    return ['ROLE_USER', 'ROLE_OWNER', 'ROLE_MODERATOR'].includes(role);
};

const authService = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.userId);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
    },

    register: async (data: RegisterData) => {
        try {
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    changePassword: async (data: ChangePasswordData) => {
        try {
            const response = await api.post('/auth/change-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: () => {
        try {
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('userRole');
            const userId = localStorage.getItem('userId');
            if (username && userId && role && isValidRole(role)) {
                return { username, role , userId};
            }
            return null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    getUserRole: (): UserRole | null => {
        const role = localStorage.getItem('userRole');
        return role && isValidRole(role) ? role : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    hasRole: (roleToCheck: UserRole) => {
        const role = localStorage.getItem('userRole');
        return role === roleToCheck;
    },

    isOwnerOrModerator: () => {
        const role = localStorage.getItem('userRole');
        return role === 'ROLE_OWNER' || role === 'ROLE_MODERATOR';
    }
};

export default authService;