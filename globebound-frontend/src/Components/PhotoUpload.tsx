import React, { useState } from 'react';
import Button from './Button';
import accommodationService from '../Services/accommodationService';

interface PhotoUploadProps {
    ownerId: number;
    accommodationId: number;
    onUploadComplete: () => void;
}

function PhotoUpload({ ownerId, accommodationId, onUploadComplete }: PhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return;

        setIsUploading(true);
        setError('');

        try {
            await accommodationService.uploadPhotos(ownerId, accommodationId, event.target.files);
            onUploadComplete();
            event.target.value = '';
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload photos. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mb-4">
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <div className="d-flex gap-3 align-items-center">
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={isUploading}
                />
                {isUploading && (
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PhotoUpload;