import React, { useState, useEffect } from 'react';
import reviewService, {ReviewRequest} from '../Services/reviewService';
import authService from '../Services/authService';
import Button from './Button';

interface ReviewSectionProps {
    accommodationId: number;
}

function ReviewSection({ accommodationId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<ReviewRequest[]>([]);
    const [newReview, setNewReview] = useState({ rating: 5, review: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchReviews();
    }, [accommodationId]);

    const fetchReviews = async () => {
        try {
            const response = await reviewService.getAccommodationReviews(accommodationId);
            const reviewsData = Array.isArray(response) ? response : [response];
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError('Failed to load reviews');
            setReviews([]);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await reviewService.createReview(accommodationId, {
                review: newReview.review,
                rating: newReview.rating
            });
            setNewReview({ rating: 5, review: '' });
            await fetchReviews();
        } catch (error: any) {
            console.error('Error submitting review:', error);
            setError(error.message || 'Failed to submit review');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        try {
            await reviewService.deleteReview(accommodationId, reviewId);
            await fetchReviews();
        } catch (error: any) {
            console.error('Error deleting review:', error);
            setError('Failed to delete review');
        }
    };

    return (
        <div className="mt-4">
            <h4 className="mb-4">Reviews and Ratings</h4>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmitReview} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Rating (1-5)</label>
                    <select
                        className="form-select"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                    >
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} ★</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Review</label>
                    <textarea
                        className="form-control"
                        value={newReview.review}
                        onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                        maxLength={200}
                        rows={3}
                        required
                        placeholder="Write your review here (max 200 characters)"
                    />
                </div>
                <Button onClick={handleSubmitReview} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </form>

            <div className="review-list">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.reviewId} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="card-subtitle text-muted">
                                        By {review.user.username}
                                    </h6>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">{review.rating} ★</span>
                                        {currentUser?.userId && Number(currentUser.userId) === review.user.userId && (
                                            <Button
                                                onClick={() => handleDeleteReview(Number(review.reviewId))}
                                                color="danger"
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <p className="card-text">{review.review}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
}

export default ReviewSection;