import React, { useEffect, useState, useRef } from 'react';
import { Map, MapPin } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface Coordinates {
    lat: number;
    lng: number;
}

interface MapLocationProps {
    address: string;
    city: string;
    country: string;
}

const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    version: "weekly",
    libraries: ["places"]
});

const MapLocation: React.FC<MapLocationProps> = ({ address, city, country }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                await loader.load();
                if (!mapRef.current) {
                    console.log("Map ref not found");
                    return;
                }

                const newMap = new google.maps.Map(mapRef.current, {
                    zoom: 15,
                    center: { lat: 0, lng: 0 },
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                });

                console.log("Map instance created");

                setMap(newMap);

                const geocoder = new google.maps.Geocoder();
                const fullAddress = `${address}, ${city}, ${country}`;
                console.log("Geocoding address:", fullAddress);

                const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                    geocoder.geocode({ address: fullAddress }, (results, status) => {
                        if (status === 'OK' && results) {
                            resolve(results);
                        } else {
                            reject(new Error('Geocoding failed'));
                        }
                    });
                });

                const location = {
                    lat: result[0].geometry.location.lat(),
                    lng: result[0].geometry.location.lng()
                };

                console.log("Location found:", location);

                setCoordinates(location);
                newMap.setCenter(location);

                new google.maps.Marker({
                    position: location,
                    map: newMap,
                    title: fullAddress,
                    animation: google.maps.Animation.DROP
                });

                setIsLoading(false);
            } catch (err) {
                setError('Failed to load map. Please try again later.');
                setIsLoading(false);
                console.error('Map initialization error:', err);
            }
        };

        if (mapRef.current) {
            initMap();
        }

        return () => {
            if (map) {
                // Cleanup if needed
            }
        };
    }, [address, city, country, mapRef.current]); // Added mapRef.current to dependencies

    if (error) {
        return (
            <div className="card mb-4">
                <div className="card-body">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                        <Map className="h-5 w-5" />
                        <h5 className="mb-0">Location</h5>
                    </div>
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5" />
                    <h5 className="mb-0">Location</h5>
                </div>

                <div
                    ref={mapRef}
                    className="w-full h-64 rounded-lg overflow-hidden"
                    style={{ minHeight: '256px' }}
                />
                <p className="text-sm text-gray-500 mt-2">
                    {address}, {city}, {country}
                </p>
            </div>
        </div>
    );
};

export default MapLocation;