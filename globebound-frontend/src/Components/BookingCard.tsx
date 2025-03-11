import React, { useState, useEffect } from 'react';
import TextField from './TextField';
import Button from './Button';
import {AccommodationRequest} from "../Services/accommodationService";
import reservationService from '../Services/reservationService';

interface BookingCardProps {
    accommodation: AccommodationRequest;
}

interface SelectedRooms {
    SINGLE: number;
    DOUBLE: number;
    TRIPLE: number;
    QUADRUPLE: number;
}

interface BookingDates {
    checkIn: string;
    checkOut: string;
}

function BookingCard({ accommodation }: BookingCardProps) {
    const [selectedRooms, setSelectedRooms] = useState<SelectedRooms>({
        SINGLE: 0,
        DOUBLE: 0,
        TRIPLE: 0,
        QUADRUPLE: 0
    });

    const [bookingDates, setBookingDates] = useState<BookingDates>({
        checkIn: '',
        checkOut: ''
    });

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        calculateTotal();
    }, [selectedRooms, bookingDates]);

    const obtainRoomType = (roomType: keyof SelectedRooms): number => {
        switch (roomType) {
            case 'SINGLE':
                return accommodation.totalSingleRooms;
            case 'DOUBLE':
                return accommodation.totalDoubleRooms;
            case 'TRIPLE':
                return accommodation.totalTripleRooms;
            case 'QUADRUPLE':
                return accommodation.totalQuadrupleRooms;
            default:
                return 0;
        }
    };

    const handleRoomChange = (roomType: keyof SelectedRooms, value: string): void => {
        const numValue = parseInt(value) || 0;
        const maxRooms = obtainRoomType(roomType);

        if (numValue < 0) {
            setError('Cannot select negative number of rooms');
            return;
        }

        if (numValue > maxRooms) {
            setError(`Only ${maxRooms} ${roomType.toLowerCase()} rooms available`);
            return;
        }

        setSelectedRooms(prev => ({
            ...prev,
            [roomType]: numValue
        }));
        setError('');
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = e.target;
        setBookingDates(prev => ({
            ...prev,
            [id]: value
        }));
        setError('');
    };

    const calculateTotal = (): void => {
        if (!bookingDates.checkIn || !bookingDates.checkOut) return;

        const checkIn = new Date(bookingDates.checkIn);
        const checkOut = new Date(bookingDates.checkOut);


        const nights = Math.floor((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) return;

        let total = 0;
        if (selectedRooms.SINGLE > 0) {
            total += selectedRooms.SINGLE * accommodation.singleRoomPrice * nights * accommodation.pricePerNight;
        }
        if (selectedRooms.DOUBLE > 0) {
            total += selectedRooms.DOUBLE * accommodation.doubleRoomPrice * nights * accommodation.pricePerNight;
        }
        if (selectedRooms.TRIPLE > 0) {
            total += selectedRooms.TRIPLE * accommodation.tripleRoomPrice * nights * accommodation.pricePerNight;
        }
        if (selectedRooms.QUADRUPLE > 0) {
            total += selectedRooms.QUADRUPLE * accommodation.quadrupleRoomPrice * nights * accommodation.pricePerNight;
        }

        setTotalPrice(total);
    };

    const handleBooking = async (): Promise<void> => {
        try {
            if (!bookingDates.checkIn || !bookingDates.checkOut) {
                setError('Please select check-in and check-out dates');
                return;
            }

            const checkIn = new Date(bookingDates.checkIn);
            const checkOut = new Date(bookingDates.checkOut);
            checkOut.setDate(checkOut.getDate() + 1); // Add one day to checkout

            if (checkIn >= checkOut) {
                setError('Check-out date must be after check-in date');
                return;
            }

            if (Object.values(selectedRooms).every(v => v === 0)) {
                setError('Please select at least one room');
                return;
            }

            const reservationData = {
                checkIn: bookingDates.checkIn,
                checkOut: bookingDates.checkOut,
                accommodation: accommodation,
                totalPrice: totalPrice,
                address: accommodation.street + ', ' + accommodation.city + ', ' + accommodation.country,
                singleRoomsNumber: selectedRooms.SINGLE,
                doubleRoomsNumber: selectedRooms.DOUBLE,
                tripleRoomsNumber: selectedRooms.TRIPLE,
                quadrupleRoomsNumber: selectedRooms.QUADRUPLE
            };

            await reservationService.createReservation(reservationData);
            alert('Booking successful!');

            // Reset form
            setSelectedRooms({
                SINGLE: 0,
                DOUBLE: 0,
                TRIPLE: 0,
                QUADRUPLE: 0
            });
            setBookingDates({
                checkIn: '',
                checkOut: ''
            });
            setTotalPrice(0);
            setError('');
        } catch (error) {
            console.error('Booking error:', error);
            setError('Failed to complete booking. Please try again.');
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Book Your Stay</h5>

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

                <div className="mb-3">
                    <label className="form-label">Check-in</label>
                    <TextField
                        id="checkIn"
                        type="date"
                        value={bookingDates.checkIn}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Check-out</label>
                    <TextField
                        id="checkOut"
                        type="date"
                        value={bookingDates.checkOut}
                        onChange={handleDateChange}
                        min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                    />
                </div>

                <h6 className="mb-3">Select Rooms:</h6>

                {accommodation.totalSingleRooms > 0 && (
                    <div className="mb-2">
                        <label className="form-label">Single Rooms</label>
                        <TextField
                            id="single-rooms"
                            type="number"
                            value={selectedRooms.SINGLE.toString()}
                            onChange={(e) => handleRoomChange('SINGLE', e.target.value)}
                            min="0"
                            max={String(accommodation.totalSingleRooms)}
                        />
                        <small className="text-muted">{accommodation.totalSingleRooms} available</small>
                    </div>
                )}

                {accommodation.totalDoubleRooms > 0 && (
                    <div className="mb-2">
                        <label className="form-label">Double Rooms</label>
                        <TextField
                            id="double-rooms"
                            type="number"
                            value={selectedRooms.DOUBLE.toString()}
                            onChange={(e) => handleRoomChange('DOUBLE', e.target.value)}
                            min="0"
                            max={String(accommodation.totalDoubleRooms)}
                        />
                        <small className="text-muted">{accommodation.totalDoubleRooms} available</small>
                    </div>
                )}

                {accommodation.totalTripleRooms > 0 && (
                    <div className="mb-2">
                        <label className="form-label">Triple Rooms</label>
                        <TextField
                            id="triple-rooms"
                            type="number"
                            value={selectedRooms.TRIPLE.toString()}
                            onChange={(e) => handleRoomChange('TRIPLE', e.target.value)}
                            min="0"
                            max={String(accommodation.totalTripleRooms)}
                        />
                        <small className="text-muted">{accommodation.totalTripleRooms} available</small>
                    </div>
                )}

                {accommodation.totalQuadrupleRooms > 0 && (
                    <div className="mb-4">
                        <label className="form-label">Quadruple Rooms</label>
                        <TextField
                            id="quadruple-rooms"
                            type="number"
                            value={selectedRooms.QUADRUPLE.toString()}
                            onChange={(e) => handleRoomChange('QUADRUPLE', e.target.value)}
                            min="0"
                            max={String(accommodation.totalQuadrupleRooms)}
                        />
                        <small className="text-muted">{accommodation.totalQuadrupleRooms} available</small>
                    </div>
                )}

                <div className="mb-4">
                    <h5>Total Price: ${totalPrice.toFixed(2)}</h5>
                </div>

                <Button onClick={handleBooking} color="primary">
                    Book Now
                </Button>
            </div>
        </div>
    );
}

export default BookingCard;