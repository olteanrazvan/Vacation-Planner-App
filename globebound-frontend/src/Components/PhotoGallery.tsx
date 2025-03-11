import React from 'react';
import Button from './Button';
import accommodationService from '../Services/accommodationService';

interface Photo {
    photoId: number;
    photoUrl: string;
    fileName: string;
}

interface PhotoGalleryProps {
    photos: Photo[];
    ownerId: number;
    accommodationId: number;
    canManage?: boolean;
    onPhotoDeleted: () => void;
}

function PhotoGallery({ photos, ownerId, accommodationId, canManage = false, onPhotoDeleted }: PhotoGalleryProps) {
    const handleDeletePhoto = async (photoId: number) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) return;

        try {
            await accommodationService.deletePhoto(ownerId, accommodationId, photoId);
            onPhotoDeleted();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete photo. Please try again.');
        }
    };

    const renderPhotoUrl = (photoUrl: string) => {
        console.log('Original photoUrl:', photoUrl);
        if (photoUrl.startsWith('http')) {
            console.log('URL starts with http, returning as-is');
            return photoUrl;
        }
        const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
        console.log('Modified URL:', `http://localhost:8080${cleanPath}`);
        return `http://localhost:8080${cleanPath}`;
    };

    return (
        <div className="row g-3">
            {photos.map((photo, index) => (
                <div key={photo.photoId} className="col-md-4">
                    <div className="card">
                        <img
                            src={renderPhotoUrl(photo.photoUrl)}
                            className="card-img-top"
                            alt={photo.fileName}
                            style={{height: '200px', objectFit: 'cover'}}
                        />
                        {canManage && (
                            <div className="card-body">
                                <Button
                                    onClick={() => handleDeletePhoto(photo.photoId)}
                                    color="danger"
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {photos.length === 0 && (
                <div className="col-12 text-center py-4">
                    <p className="text-muted">No photos available</p>
                </div>
            )}
        </div>
    );
}

export default PhotoGallery;