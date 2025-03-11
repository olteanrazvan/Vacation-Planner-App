import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import TextField from '../Components/TextField';
import accommodationService, { AccommodationType, AccommodationRequest } from '../Services/accommodationService';
import PhotoUpload from '../Components/PhotoUpload';
import PhotoGallery from '../Components/PhotoGallery';

function OwnerAccommodations() {
    const [accommodations, setAccommodations] = useState<AccommodationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        country: '',
        city: '',
        street: '',
        description: '',
        pricePerNight: '0',
        singleRoomPrice: '0',
        doubleRoomPrice: '0',
        tripleRoomPrice: '0',
        quadrupleRoomPrice: '0',
        accommodationType: AccommodationType.HOTEL,
        totalSingleRooms: '0',
        totalDoubleRooms: '0',
        totalTripleRooms: '0',
        totalQuadrupleRooms: '0'
    });

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
        try {
            const ownerId = localStorage.getItem('userId');
            if (!ownerId) throw new Error('Owner ID not found');
            const data = await accommodationService.getOwnerAccommodations(Number(ownerId));
            console.log(data)
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            console.log(parsedData)
            const accommodationsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
            console.log(accommodationsArray)
            setAccommodations(accommodationsArray);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load accommodations');
            setAccommodations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const ownerId = localStorage.getItem('userId');
            if (!ownerId) throw new Error('Owner ID not found');
            const numericFormData = {
                ...formData,
                pricePerNight: Number(formData.pricePerNight),
                singleRoomPrice: Number(formData.singleRoomPrice),
                doubleRoomPrice: Number(formData.doubleRoomPrice),
                tripleRoomPrice: Number(formData.tripleRoomPrice),
                quadrupleRoomPrice: Number(formData.quadrupleRoomPrice),
                totalSingleRooms: Number(formData.totalSingleRooms),
                totalDoubleRooms: Number(formData.totalDoubleRooms),
                totalTripleRooms: Number(formData.totalTripleRooms),
                totalQuadrupleRooms: Number(formData.totalQuadrupleRooms)
            };
            console.log(numericFormData)
            if (editingId) {
                await accommodationService.updateAccommodation(Number(ownerId), editingId, numericFormData);
            } else {
                await accommodationService.createAccommodation(Number(ownerId), numericFormData);
            }

            await fetchAccommodations();
            setShowAddForm(false);
            setFormData({
                name: '',
                country: '',
                city: '',
                street: '',
                description: '',
                pricePerNight: '0',
                singleRoomPrice: '0',
                doubleRoomPrice: '0',
                tripleRoomPrice: '0',
                quadrupleRoomPrice: '0',
                accommodationType: AccommodationType.HOTEL,
                totalSingleRooms: '0',
                totalDoubleRooms: '0',
                totalTripleRooms: '0',
                totalQuadrupleRooms: '0'
            });
        } catch (error) {
            setError('Failed to save accommodation');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>My Properties</h2>
                    <Button onClick={() => setShowAddForm(true)}>Add New Property</Button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {showAddForm && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3>{editingId ? 'Edit Property' : 'Add New Property'}</h3>
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-6">
                                    <TextField
                                        id="name"
                                        type="text"
                                        placeholder="Property Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={formData.accommodationType}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            accommodationType: e.target.value as AccommodationType
                                        })}
                                    >
                                        {Object.values(AccommodationType).map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="country"
                                        type="text"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="city"
                                        type="text"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="street"
                                        type="text"
                                        placeholder="Street"
                                        value={formData.street}
                                        onChange={(e) => setFormData({...formData, street: e.target.value})}
                                    />
                                </div>
                                <div className="col-12">
                                    <textarea
                                        className="form-control"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <h5 className="mt-4">Room Pricing</h5>
                                <div className="col-md-4">
                                    <TextField
                                        id="pricePerNight"
                                        type="number"
                                        placeholder="Price per night"
                                        value={formData.pricePerNight}
                                        onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="singleRoomPrice"
                                        type="number"
                                        placeholder="Single Room Price"
                                        value={formData.singleRoomPrice}
                                        onChange={(e) => setFormData({...formData, singleRoomPrice: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="doubleRoomPrice"
                                        type="number"
                                        placeholder="Double Room Price"
                                        value={formData.doubleRoomPrice}
                                        onChange={(e) => setFormData({...formData, doubleRoomPrice: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="tripleRoomPrice"
                                        type="number"
                                        placeholder="Triple Room Price"
                                        value={formData.tripleRoomPrice}
                                        onChange={(e) => setFormData({...formData, tripleRoomPrice: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <TextField
                                        id="quadrupleRoomPrice"
                                        type="number"
                                        placeholder="Quadruple Room Price"
                                        value={formData.quadrupleRoomPrice}
                                        onChange={(e) => setFormData({...formData, quadrupleRoomPrice: e.target.value})}
                                    />
                                </div>

                                <h5 className="mt-4">Room Availability</h5>
                                <div className="col-md-3">
                                    <TextField
                                        id="totalSingleRooms"
                                        type="number"
                                        placeholder="Total Single Rooms"
                                        value={formData.totalSingleRooms}
                                        onChange={(e) => setFormData({...formData, totalSingleRooms: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        id="totalDoubleRooms"
                                        type="number"
                                        placeholder="Total Double Rooms"
                                        value={formData.totalDoubleRooms}
                                        onChange={(e) => setFormData({...formData, totalDoubleRooms: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        id="totalTripleRooms"
                                        type="number"
                                        placeholder="Total Triple Rooms"
                                        value={formData.totalTripleRooms}
                                        onChange={(e) => setFormData({...formData, totalTripleRooms: e.target.value})}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        id="totalQuadrupleRooms"
                                        type="number"
                                        placeholder="Total Quadruple Rooms"
                                        value={formData.totalQuadrupleRooms}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            totalQuadrupleRooms: e.target.value
                                        })}
                                    />
                                </div>

                                <div className="col-12 mt-4">
                                    <div className="d-flex gap-2">
                                        <Button onClick={handleSubmit}>
                                            {editingId ? 'Save Changes' : 'Add Property'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setEditingId(null);
                                            }}
                                            color="secondary"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="row">
                    {accommodations.map((accommodation) => (
                        <div key={accommodation.accommodationId} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{accommodation.name}</h5>
                                    <p className="card-text text-muted">
                                        {accommodation.city}, {accommodation.country}
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">{accommodation.accommodationType}</small>
                                    </p>
                                    <div className="d-flex gap-2">
                                        <Button onClick={() => {
                                            const formattedData = {
                                                ...accommodation,
                                                pricePerNight: accommodation.pricePerNight.toString(),
                                                singleRoomPrice: accommodation.singleRoomPrice.toString(),
                                                doubleRoomPrice: accommodation.doubleRoomPrice.toString(),
                                                tripleRoomPrice: accommodation.tripleRoomPrice.toString(),
                                                quadrupleRoomPrice: accommodation.quadrupleRoomPrice.toString(),
                                                totalSingleRooms: accommodation.totalSingleRooms.toString(),
                                                totalDoubleRooms: accommodation.totalDoubleRooms.toString(),
                                                totalTripleRooms: accommodation.totalTripleRooms.toString(),
                                                totalQuadrupleRooms: accommodation.totalQuadrupleRooms.toString()
                                            };
                                            setFormData(formattedData);
                                            setShowAddForm(true);
                                        }}>
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                if (accommodation.accommodationId && window.confirm('Are you sure you want to delete this property?')) {
                                                    try {
                                                        const ownerId = localStorage.getItem('userId');
                                                        if (!ownerId) throw new Error('Owner ID not found');
                                                        await accommodationService.deleteAccommodation(Number(ownerId), accommodation.accommodationId);
                                                        await fetchAccommodations();
                                                    } catch (error) {
                                                        setError('Failed to delete accommodation');
                                                    }
                                                }
                                            }}
                                            color="danger"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    <div className="mt-3">
                                        <h6>Photos</h6>
                                        <PhotoUpload
                                            ownerId={Number(localStorage.getItem('userId'))}
                                            accommodationId={Number(accommodation.accommodationId)}
                                            onUploadComplete={fetchAccommodations}
                                        />
                                        <PhotoGallery
                                            photos={accommodation.photos || []}
                                            ownerId={Number(localStorage.getItem('userId'))}
                                            accommodationId={Number(accommodation.accommodationId)}
                                            canManage={true}
                                            onPhotoDeleted={fetchAccommodations}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default OwnerAccommodations;