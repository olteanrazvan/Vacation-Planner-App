import { api } from './authService';

export interface ReviewRequest {
    reviewId?: number;
    review: string;
    rating: number;
    accommodation: {
        id: number;
    };
    user: {
        userId: number;
        username: string;
    };
}

const reviewService = {
    getAccommodationReviews: async (accommodationId: number): Promise<ReviewRequest[]> => {
        const response = await api.get(`/content/accommodations/${accommodationId}/reviews`);
        return response.data;
    },

    createReview: async (accommodationId: number, reviewData: { review: string; rating: number }): Promise<ReviewRequest> => {
        const response = await api.post(`/content/accommodations/${accommodationId}/reviews`, reviewData);
        return response.data;
    },

    deleteReview: async (accommodationId: number, reviewId: number): Promise<void> => {
        await api.delete(`/content/accommodations/${accommodationId}/reviews/${reviewId}`);
    },

    updateReview: async (accommodationId: number, reviewId: number, reviewData: { review: string; rating: number }): Promise<ReviewRequest> => {
        const response = await api.put(`/content/accommodations/${accommodationId}/reviews/${reviewId}`, reviewData);
        return response.data;
    }
};

export default reviewService;