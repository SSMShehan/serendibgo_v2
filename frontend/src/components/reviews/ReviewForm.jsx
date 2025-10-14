import React, { useState } from 'react';
import { Star, Send, X, AlertCircle, CheckCircle } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({ guideId, tourId, bookingId, onReviewSubmitted, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
    setError('');
  };

  const handleRatingHover = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewData = {
        tourId,
        guideId,
        bookingId,
        rating,
        comment: comment.trim()
      };

      await reviewService.createReview(reviewData);
      
      setSuccess('Review submitted successfully!');
      setTimeout(() => {
        onReviewSubmitted();
      }, 1500);

    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={handleRatingLeave}
          className={`p-1 transition-all duration-200 ${
            i <= displayRating 
              ? 'text-yellow-400 scale-110' 
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        >
          <Star 
            className={`h-8 w-8 ${
              i <= displayRating ? 'fill-current' : ''
            }`} 
          />
        </button>
      );
    }

    return stars;
  };

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || '';
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Review Submitted!</h3>
          <p className="text-green-600">{success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Write a Review</h3>
          <p className="text-slate-600">Share your experience with this guide</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Rate your experience *
          </label>
          <div className="flex items-center space-x-2 mb-2">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-3 text-lg font-semibold text-slate-700">
                {getRatingText(rating)}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Click on a star to rate from 1 (Poor) to 5 (Excellent)
          </p>
        </div>

        {/* Comment Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Write your review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder="Tell others about your experience with this guide. What did you like? What could be improved?"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-white transition-all duration-200 font-medium resize-none"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-slate-500">
              Minimum 10 characters, maximum 1000 characters
            </p>
            <span className={`text-sm font-medium ${
              comment.length > 1000 ? 'text-red-500' : 'text-slate-500'
            }`}>
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !rating || !comment.trim() || comment.trim().length < 10}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>

      {/* Review Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <h4 className="font-semibold text-blue-800 mb-2">Review Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be honest and constructive in your feedback</li>
          <li>• Focus on your actual experience with the guide</li>
          <li>• Avoid personal attacks or inappropriate language</li>
          <li>• Your review helps other travelers make informed decisions</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewForm;

