"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FactoryReviewForm({ factoryId }: { factoryId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/buyer/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factoryId, rating, comment })
      });
      if (res.ok) {
        alert('Thank you for your review!');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit review.');
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border space-y-4">
      <h3 className="font-bold text-sm">Write a Review</h3>
      
      <div>
        <p className="text-xs text-muted-foreground mb-2">Tap a star to rate</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star 
                className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <textarea 
          placeholder="Share details of your experience with this factory..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={submitting || rating === 0}
          className="bg-primary text-white px-6 py-2 rounded-md text-sm font-bold shadow hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Post Review'}
        </button>
      </div>
    </form>
  );
}
