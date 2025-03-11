import { api } from './authService';
import { AccommodationRequest } from './accommodationService';

export interface ReservationRequest {
    reservationId?: number;
    accommodation: AccommodationRequest;
    totalPrice: number;
    checkIn: any;
    checkOut: any;
    address: string;
    singleRoomsNumber: number;
    doubleRoomsNumber: number;
    tripleRoomsNumber: number;
    quadrupleRoomsNumber: number;
    user?: any;
}

const getCurrentUserId = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    return userId;
};

const formatDate = (date: string): string => {
    return new Date(date).toISOString().split('T')[0];
};

const reservationService = {
    createReservation: async (reservationData: Omit<ReservationRequest, 'reservationId' | 'user'>): Promise<ReservationRequest> => {
        const userId = getCurrentUserId();

        const formattedData = {
            ...reservationData,
            checkIn: formatDate(reservationData.checkIn),
            checkOut: formatDate(reservationData.checkOut)
        };
        const response = await api.post(`/content/users/${userId}/reservations`, formattedData);
        return response.data;
    },

    getUserReservations: async (): Promise<ReservationRequest[]> => {
        const userId = getCurrentUserId();
        const response = await api.get(`/content/users/${userId}/reservations`);
        return response.data.map((reservation: ReservationRequest) => ({
            ...reservation,
            checkIn: formatDate(reservation.checkIn),
            checkOut: formatDate(reservation.checkOut)
        }));
    },

    updateReservation: async (reservationId: number, updateData: Partial<ReservationRequest>): Promise<ReservationRequest> => {
        const userId = getCurrentUserId();
        // Format dates before sending to backend
        const formattedData = {
            ...updateData,
            checkIn: updateData.checkIn ? formatDate(updateData.checkIn) : undefined,
            checkOut: updateData.checkOut ? formatDate(updateData.checkOut) : undefined
        };
        const response = await api.put(`/content/users/${userId}/reservations/${reservationId}`, formattedData);
        return response.data;
    },

    cancelReservation: async (reservationId: number): Promise<void> => {
        const userId = getCurrentUserId();
        await api.delete(`/content/users/${userId}/reservations/${reservationId}`);
    }
};

export default reservationService;