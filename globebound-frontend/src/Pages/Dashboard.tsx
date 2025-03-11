import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import TextField from '../Components/TextField';
import Button from '../Components/Button';
import accommodationService, {AccommodationRequest} from '../Services/accommodationService';

interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
}

function Dashboard() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState<SearchParams>({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: ''
    });
    const [accommodations, setAccommodations] = useState<AccommodationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
        try {
            const data = await accommodationService.getAllAccommodations();
            setAccommodations(data);
        } catch (error) {
            setError('Failed to load accommodations');
            console.error('Error fetching accommodations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            let filteredAccommodations;
            if (searchParams.location) {
                // If location is provided, filter by city
                filteredAccommodations = await accommodationService.getAccommodationByCity(searchParams.location);
            } else {
                // Otherwise, get all accommodations
                filteredAccommodations = await accommodationService.getAllAccommodations();
            }
            setAccommodations(filteredAccommodations);
        } catch (error) {
            setError('Failed to search accommodations');
            console.error('Error searching accommodations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <Layout>
            <div className="container py-4">
                {/* Search Section */}
                <div className="card mb-4 shadow">
                    <div className="card-body">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="row g-3">
                            <div className="col-md-3">
                                <TextField
                                    id="location"
                                    type="text"
                                    placeholder="Where are you going?"
                                    value={searchParams.location}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField
                                    id="checkIn"
                                    type="date"
                                    placeholder="Check-in"
                                    value={searchParams.checkIn}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <TextField
                                    id="checkOut"
                                    type="date"
                                    placeholder="Check-out"
                                    value={searchParams.checkOut}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <TextField
                                    id="guests"
                                    type="number"
                                    placeholder="Guests"
                                    value={searchParams.guests}
                                    onChange={handleSearchParamChange}
                                />
                            </div>
                            <div className="col-md-1">
                                <Button onClick={handleSearch}>
                                    Search
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    /* Results Section */
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {accommodations.map(accommodation => (
                            <div key={accommodation.accommodationId} className="col">
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={accommodation.photos?.[0]?.photoUrl || "/api/placeholder/300/200"}
                                        className="card-img-top"
                                        alt={accommodation.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{accommodation.name}</h5>
                                        <p className="card-text text-muted mb-1">
                                            {accommodation.city}, {accommodation.country}
                                        </p>
                                        <p className="card-text mb-1">
                                            <small className="text-muted">{accommodation.accommodationType}</small>
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="h5 mb-0">${accommodation.pricePerNight} / night</span>
                                            <div>
                                                {/*{accommodation.rating && (*/}
                                                {/*    <span className="me-2">★ {accommodation.rating.toFixed(1)}</span>*/}
                                                {/*)}*/}
                                                <Button onClick={() => navigate(`/accommodation/${accommodation.accommodationId}`)}>
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* No results message */}
                        {accommodations.length === 0 && !isLoading && (
                            <div className="col-12 text-center py-4">
                                <h4>No accommodations found</h4>
                                <p className="text-muted">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Dashboard;