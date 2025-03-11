import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import TextField from '../Components/TextField';
import ReviewSection from '../Components/ReviewSection';
import accommodationService, {AccommodationRequest} from '../Services/accommodationService';
import PhotoUpload from '../Components/PhotoUpload';
import PhotoGallery from '../Components/PhotoGallery';
import BookingCard from "../Components/BookingCard";
import MapLocation from '../Components/MapLocation';

interface SelectedDates {
    checkIn: string;
    checkOut: string;
    guests: string;
}

function AccommodationDetail() {
    const { id } = useParams();
    const [selectedDates, setSelectedDates] = useState<SelectedDates>({
        checkIn: '',
        checkOut: '',
        guests: '1'
    });
    const [accommodation, setAccommodation] = useState<AccommodationRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAccommodationDetails();
    }, [id]);

    const fetchAccommodationDetails = async () => {
        if (!id) return;

        try {
            const data = await accommodationService.getAccommodationById(Number(id));
            setAccommodation(data);
        } catch (error) {
            setError('Failed to load accommodation details');
            console.error('Error fetching accommodation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSelectedDates(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBooking = () => {
        // TODO: Implement booking logic
        console.log('Booking with dates:', selectedDates);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container py-4">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !accommodation) {
        return (
            <Layout>
                <div className="container py-4">
                    <div className="alert alert-danger" role="alert">
                        {error || 'Accommodation not found'}
                    </div>
                </div>
            </Layout>
        );
    }

    const amenities = [
        'WiFi',
        'Air Conditioning',
        'Kitchen',
        'Washer',
        'Free Parking'
    ];

    return (
        <Layout>
            <div className="container py-4">
                <div className="row">
                    {/* Main Content */}
                    <div className="col-md-8">
                        {/* Image Gallery */}
                        <div className="card mb-4">
                            <PhotoGallery
                                photos={accommodation.photos || []}
                                ownerId={accommodation.owner?.ownerId || 0}
                                accommodationId={Number(accommodation.accommodationId)}
                                canManage={false}
                                onPhotoDeleted={fetchAccommodationDetails}
                            />
                        </div>

                        {/* Map Section */}
                        <MapLocation
                            address={accommodation.street}
                            city={accommodation.city}
                            country={accommodation.country}
                        />

                        {/* Description */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h1 className="card-title">{accommodation.name}</h1>
                                <p className="text-muted">
                                    {accommodation.street}, {accommodation.city}, {accommodation.country}
                                </p>
                                <hr/>
                                <h5>Description</h5>
                                <p>{accommodation.description}</p>

                                <h5>Room Types and Prices</h5>
                                <ul className="list-unstyled">
                                    {accommodation.totalSingleRooms > 0 && (
                                        <li>Single Rooms: ${accommodation.singleRoomPrice}/night
                                            ({accommodation.totalSingleRooms} available)</li>
                                    )}
                                    {accommodation.totalDoubleRooms > 0 && (
                                        <li>Double Rooms: ${accommodation.doubleRoomPrice}/night
                                            ({accommodation.totalDoubleRooms} available)</li>
                                    )}
                                    {accommodation.totalTripleRooms > 0 && (
                                        <li>Triple Rooms: ${accommodation.tripleRoomPrice}/night
                                            ({accommodation.totalTripleRooms} available)</li>
                                    )}
                                    {accommodation.totalQuadrupleRooms > 0 && (
                                        <li>Quadruple Rooms: ${accommodation.quadrupleRoomPrice}/night
                                            ({accommodation.totalQuadrupleRooms} available)</li>
                                    )}
                                </ul>

                                <h5>Amenities</h5>
                                <ul className="list-unstyled row">
                                    {amenities.map((amenity, index) => (
                                        <li key={index} className="col-md-4 mb-2">
                                            ✓ {amenity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="card">
                            <div className="card-body">
                                <ReviewSection accommodationId={Number(id)}/>
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="col-md-4">
                        <div className="sticky-top" style={{top: '20px'}}>
                            <BookingCard accommodation={accommodation} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AccommodationDetail;