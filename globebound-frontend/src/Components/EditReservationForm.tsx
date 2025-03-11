import React, { useState } from 'react';
import TextField from './TextField';
import Button from './Button';
import { ReservationRequest } from '../Services/reservationService';

interface EditReservationFormProps {
    reservation: ReservationRequest;
    onSubmit: (reservationId: number, formData: {checkIn: string, checkOut: string}) => Promise<void>;
    onCancel: () => void;
}

function EditReservationForm({ reservation, onSubmit, onCancel }: EditReservationFormProps) {
    const [formData, setFormData] = useState({
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        singleRoomsNumber: reservation.singleRoomsNumber,
        doubleRoomsNumber: reservation.doubleRoomsNumber,
        tripleRoomsNumber: reservation.tripleRoomsNumber,
        quadrupleRoomsNumber: reservation.quadrupleRoomsNumber,
    });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate dates
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);

        if (checkOut <= checkIn) {
            setError('Check-out date must be after check-in date');
            return;
        }

        // Validate room numbers
        const totalRooms = formData.singleRoomsNumber + formData.doubleRoomsNumber +
            formData.tripleRoomsNumber + formData.quadrupleRoomsNumber;

        if (totalRooms === 0) {
            setError('Please select at least one room');
            return;
        }

        // Validate against maximum available rooms
        if (formData.singleRoomsNumber > reservation.accommodation.totalSingleRooms ||
            formData.doubleRoomsNumber > reservation.accommodation.totalDoubleRooms ||
            formData.tripleRoomsNumber > reservation.accommodation.totalTripleRooms ||
            formData.quadrupleRoomsNumber > reservation.accommodation.totalQuadrupleRooms) {
            setError('Selected rooms exceed available capacity');
            return;
        }

        if (reservation.reservationId) {
            onSubmit(reservation.reservationId, formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger mb-3">
                    {error}
                    <button
                        type="button"
                        className="btn-close float-end"
                        onClick={() => setError('')}
                        aria-label="Close"
                    />
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Check-in Date</label>
                <TextField
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({
                        ...formData,
                        checkIn: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Check-out Date</label>
                <TextField
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({
                        ...formData,
                        checkOut: e.target.value
                    })}
                    min={formData.checkIn}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Room Selection</label>
                <div className="row g-3">
                    {reservation.accommodation.totalSingleRooms > 0 && (
                        <div className="col-md-6">
                            <label className="form-label">Single Rooms</label>
                            <TextField
                                id="singleRooms"
                                type="number"
                                value={formData.singleRoomsNumber.toString()}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    singleRoomsNumber: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max={reservation.accommodation.totalSingleRooms.toString()}
                            />
                        </div>
                    )}

                    {reservation.accommodation.totalDoubleRooms > 0 && (
                        <div className="col-md-6">
                            <label className="form-label">Double Rooms</label>
                            <TextField
                                id="doubleRooms"
                                type="number"
                                value={formData.doubleRoomsNumber.toString()}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    doubleRoomsNumber: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max={reservation.accommodation.totalDoubleRooms.toString()}
                            />
                        </div>
                    )}

                    {reservation.accommodation.totalTripleRooms > 0 && (
                        <div className="col-md-6">
                            <label className="form-label">Triple Rooms</label>
                            <TextField
                                id="tripleRooms"
                                type="number"
                                value={formData.tripleRoomsNumber.toString()}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    tripleRoomsNumber: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max={reservation.accommodation.totalTripleRooms.toString()}
                            />
                        </div>
                    )}

                    {reservation.accommodation.totalQuadrupleRooms > 0 && (
                        <div className="col-md-6">
                            <label className="form-label">Quadruple Rooms</label>
                            <TextField
                                id="quadrupleRooms"
                                type="number"
                                value={formData.quadrupleRoomsNumber.toString()}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    quadrupleRoomsNumber: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max={reservation.accommodation.totalQuadrupleRooms.toString()}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex gap-2">
                <Button
                    onClick={(e) => handleSubmit(e)}
                    type="submit"
                >
                    Save Changes
                </Button>
                <Button
                    onClick={() => onCancel()}
                    color="secondary"
                    type="button"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}

export default EditReservationForm;