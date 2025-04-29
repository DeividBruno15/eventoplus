
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  userImage: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export const ReviewsTab = ({ reviews, rating, reviewCount }: ReviewsTabProps) => {
  return (
    <>
      <div className="mb-6 flex items-center">
        <div className="mr-4">
          <div className="text-5xl font-bold text-gray-800">
            {rating}
          </div>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {reviewCount} avaliações
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center">
                <span className="text-sm w-4 mr-2">{star}</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ 
                      width: `${
                        reviews.filter(r => Math.floor(r.rating) === star).length / 
                        reviews.length * 100
                      }%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">
                  {reviews.filter(r => Math.floor(r.rating) === star).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-muted pb-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                <img 
                  src={review.userImage} 
                  alt={review.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{review.name}</h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex mt-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
