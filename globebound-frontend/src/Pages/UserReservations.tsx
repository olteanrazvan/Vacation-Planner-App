import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import reservationService, { ReservationRequest } from '../Services/reservationService';
import EditReservationForm from '../Components/EditReservationForm';

function UserReservations() {
    const [reservations, setReservations] = useState<ReservationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const data = await reservationService.getUserReservations();
            setReservations(Array.isArray(data) ? data : [data]);
            setError('');
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError('Failed to load your reservations. Please try again later.');
            setReservations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, reservationId: number) => {
        e.preventDefault();

        if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
            return;
        }

        try {
            await reservationService.cancelReservation(reservationId);
            await fetchReservations();
            setError('');
        } catch (err) {
            console.error('Error canceling reservation:', err);
            setError('Failed to cancel reservation. Please try again.');
        }
    };

    const calculateNights = (checkIn: string, checkOut: string): number => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        end.setDate(end.getDate() + 1);
        return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    const handleEditSubmit = async (reservationId: number, formData: any) => {
        try {
            const currentReservation = reservations.find(r => r.reservationId === reservationId);
            if (!currentReservation) {
                setError('Reservation not found');
                return;
            }

            const checkIn = new Date(formData.checkIn);
            const checkOut = new Date(formData.checkOut);

            if (checkIn >= checkOut) {
                setError('Check-out date must be after check-in date');
                return;
            }

            const nights = calculateNights(formData.checkIn, formData.checkOut);
            const totalPrice = calculateTotalPrice(currentReservation, nights);

            await reservationService.updateReservation(reservationId, {
                ...currentReservation,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                totalPrice: totalPrice,
            });

            await fetchReservations();
            setEditingId(null);
            setError('');
        } catch (err) {
            console.error('Error updating reservation:', err);
            setError('Failed to update reservation. Please try again.');
        }
    };

    const calculateTotalPrice = (reservation: ReservationRequest, nights: number): number => {
        let total = 0;
        const pricePerNight = reservation.accommodation.pricePerNight;
        if (reservation.singleRoomsNumber > 0) {
            total += reservation.singleRoomsNumber * reservation.accommodation.singleRoomPrice * nights * pricePerNight;
        }
        if (reservation.doubleRoomsNumber > 0) {
            total += reservation.doubleRoomsNumber * reservation.accommodation.doubleRoomPrice * nights * pricePerNight;
        }
        if (reservation.tripleRoomsNumber > 0) {
            total += reservation.tripleRoomsNumber * reservation.accommodation.tripleRoomPrice * nights * pricePerNight;
        }
        if (reservation.quadrupleRoomsNumber > 0) {
            total += reservation.quadrupleRoomsNumber * reservation.accommodation.quadrupleRoomPrice * nights * pricePerNight;
        }

        return total;
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container py-4">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>My Reservations</h2>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                            aria-label="Close"
                        />
                    </div>
                )}

                {reservations.length === 0 ? (
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="card-title">No Reservations Found</h5>
                            <p className="card-text">You haven't made any reservations yet.</p>
                            <Button
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Browse Accommodations
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {reservations.map((reservation) => (
                            <div key={reservation.reservationId} className="col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">
                                            {reservation.accommodation.name}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {editingId === reservation.reservationId ? (
                                            <EditReservationForm
                                                reservation={reservation}
                                                onSubmit={handleEditSubmit}
                                                onCancel={() => setEditingId(null)}
                                            />
                                        ) : (
                                            <>
                                                <div className="mb-2">
                                                    <strong>Location:</strong>{' '}
                                                    {reservation.accommodation.city}, {reservation.accommodation.country}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Check-in:</strong>{' '}
                                                    {new Date(reservation.checkIn).toLocaleDateString()}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Check-out:</strong>{' '}
                                                    {new Date(reservation.checkOut).toLocaleDateString()}
                                                </div>
                                                <div className="mb-2">
                                                    <strong>Duration:</strong>{' '}
                                                    {calculateNights(reservation.checkIn, reservation.checkOut)} nights
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Total Price:</strong>{' '}
                                                    ${reservation.totalPrice}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Rooms:</strong>
                                                    <ul className="list-unstyled ms-3">
                                                        {reservation.singleRoomsNumber > 0 && (
                                                            <li>{reservation.singleRoomsNumber} Single Room(s)</li>
                                                        )}
                                                        {reservation.doubleRoomsNumber > 0 && (
                                                            <li>{reservation.doubleRoomsNumber} Double Room(s)</li>
                                                        )}
                                                        {reservation.tripleRoomsNumber > 0 && (
                                                            <li>{reservation.tripleRoomsNumber} Triple Room(s)</li>
                                                        )}
                                                        {reservation.quadrupleRoomsNumber > 0 && (
                                                            <li>{reservation.quadrupleRoomsNumber} Quadruple Room(s)</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {!editingId && (
                                        <div className="card-footer d-flex gap-2">
                                            <Button onClick={() => setEditingId(reservation.reservationId ?? null)}>
                                                Edit Dates
                                            </Button>
                                            <Button
                                                onClick={(e) => reservation.reservationId &&
                                                    handleDelete(e, reservation.reservationId)}
                                                color="danger"
                                            >
                                                Cancel Reservation
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default UserReservations;