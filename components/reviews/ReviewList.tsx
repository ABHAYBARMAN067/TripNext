'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ReviewCard from './ReviewCard';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ReviewList({ listingId, reviews: initialReviews }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingId,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setReviews(prev => [data, ...prev]);
                setFormData({ rating: 5, comment: '' });
                setShowForm(false);
                toast.success('Review submitted successfully!');
            } else {
                toast.error(data.error || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value,
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Reviews</h3>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Write Review'}
                </Button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>
                                    {num} Star{num !== 1 ? 's' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        placeholder="Share your experience..."
                        as="textarea"
                        rows={4}
                    />

                    <Button type="submit" loading={loading}>
                        Submit Review
                    </Button>
                </form>
            )}

            {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to leave a review!
                </p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}