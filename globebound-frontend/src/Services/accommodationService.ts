import { api } from './authService';

export enum AccommodationType {
    HOTEL = 'HOTEL',
    APARTMENT = 'APARTMENT',
    GUESTHOUSE = 'GUESTHOUSE',
    HOSTEL = 'HOSTEL'
}

interface AccommodationPhotoRequest {
    photoId: number;
    photoUrl: string;
    fileName: string;
}

export interface AccommodationRequest {
    accommodationId?: number;
    name: string;
    country: string;
    city: string;
    street: string;
    description: string;
    pricePerNight: number;
    singleRoomPrice: number;
    doubleRoomPrice: number;
    tripleRoomPrice: number;
    quadrupleRoomPrice: number;
    accommodationType: AccommodationType;
    totalSingleRooms: number;
    totalDoubleRooms: number;
    totalTripleRooms: number;
    totalQuadrupleRooms: number;
    owner?: any;
    photos?: any[];
    reviews?: any[];
    reservations?: any[];
}

const accommodationService = {
    getOwnerAccommodations: async (userId: number): Promise<AccommodationRequest[]> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        const response = await api.get(`/owners/${ownerId}/accommodations`);
        return response.data;
    },

    createAccommodation: async (userId: number, accommodation: Omit<AccommodationRequest, 'accommodationId'>): Promise<AccommodationRequest> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        console.log(accommodation)
        const ownerResponse = await api.post(`/owners/${ownerId}/accommodations`, accommodation);
        await api.post('/content/accommodations', accommodation);
        return ownerResponse.data;
    },

    updateAccommodation: async (userId: number, accommodationId: number, accommodation: Partial<AccommodationRequest>): Promise<AccommodationRequest> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        const ownerResponse = await api.put(`/owners/${ownerId}/accommodations/${accommodationId}`, accommodation);
        await api.put(`/content/accommodations/${accommodationId}`, accommodation);
        return ownerResponse.data;
    },

    deleteAccommodation: async (userId: number, accommodationId: number): Promise<void> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        await api.delete(`/owners/${ownerId}/accommodations/${accommodationId}`);
    },

    getAllAccommodations: async (): Promise<AccommodationRequest[]> => {
        const response = await api.get('/content/accommodations');
        return response.data;
    },

    getAccommodationByCity: async (city: string): Promise<AccommodationRequest[]> => {
        const response = await api.get(`/content/accommodations?city=${city}`);
        return response.data;
    },

    getAccommodationById: async (id: number): Promise<AccommodationRequest> => {
        const response = await api.get(`/content/accommodations/${id}`);
        return response.data;
    },

    getAccommodationPhotos: async (userId: number, accommodationId: number): Promise<AccommodationPhotoRequest[]> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        const response = await api.get(`/owners/${ownerId}/accommodations/${accommodationId}/photos`);
        return response.data;
    },

    uploadPhotos: async (userId: number, accommodationId: number, files: FileList): Promise<AccommodationPhotoRequest[]> => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        const response = await api.post(`/owners/${ownerId}/accommodations/${accommodationId}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deletePhoto: async (userId: number, accommodationId: number, photoId: number): Promise<AccommodationPhotoRequest> => {
        const owner = await api.get(`/content/users/owner/${userId}`)
        const ownerId = owner.data.ownerId
        const response = await api.delete(`/owners/${ownerId}/accommodations/${accommodationId}/photos/${photoId}`);
        return response.data;
    }
};

export default accommodationService;